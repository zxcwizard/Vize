pub mod entities {
    pub mod board;
    pub mod message;
    pub mod room_key;
}

use crate::entities::message::WsMessage;
use crate::entities::room_key::RoomKey;
use axum::extract::ws::{Message, WebSocket};
use axum::extract::{State, WebSocketUpgrade};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use axum_extra::extract::CookieJar;
use dashmap::DashMap;
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;
use tokio::sync::mpsc;
use tokio::sync::mpsc::UnboundedSender;
use tower_http::cors::CorsLayer;
use uuid::Uuid;

type ConnectionRegistry = Arc<DashMap<RoomKey, DashMap<Uuid, UnboundedSender<Message>>>>;

#[tokio::main]
async fn main() {
    let connections: ConnectionRegistry = Arc::new(DashMap::new());

    let app = Router::new()
        .route("/ws", get(init_socket))
        .route("/broadcast", post(broadcast_handler))
        .with_state(connections)
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:4000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn broadcast_handler(
    State(registry): State<ConnectionRegistry>,
    jar: CookieJar,
    Json(payload): Json<WsMessage>,
) -> Response {
    let Some("secret") = jar.get("Internal-Secret").map(|v| v.value()) else {
        return StatusCode::UNAUTHORIZED.into_response();
    };

    let roomkey = payload.get_key();

    let Ok(json_string) = serde_json::to_string(&payload) else {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    };
    let message = Message::Text(json_string.into());

    if let Some(room) = registry.get(&roomkey) {
        for entry in room.iter() {
            println!("here");
            let _ = entry.value().send(message.clone());
        }
    }

    StatusCode::OK.into_response()
}

async fn init_socket(
    ws: WebSocketUpgrade,
    jar: CookieJar,
    State(registry): State<ConnectionRegistry>,
) -> Response {
    let uuid = jar
        .get("guest_id")
        .and_then(|cookie| Uuid::parse_str(cookie.value()).ok());

    match uuid {
        Some(id) => ws.on_upgrade(move |socket| handle_socket(socket, id, registry)),
        None => {
            println!("Invalid or missing UUID cookie");
            IntoResponse::into_response((StatusCode::BAD_REQUEST, "Invalid User Cookie"))
        }
    }
}

async fn handle_socket(socket: WebSocket, uuid: Uuid, registry: ConnectionRegistry) {
    let (mut ws_sender, mut ws_receiver) = socket.split();
    let (tx, mut rx) = mpsc::unbounded_channel::<Message>();

    loop {
        tokio::select! {
            client_msg = ws_receiver.next() => {
                let msg = match client_msg {
                    Some(Ok(m)) => m,
                    Some(Err(e)) => { eprintln!("WS Error: {e}"); break; }
                    None => break,
                };
                let Message::Text(text) = msg else {
                    if let Message::Close(_) = msg { break; }
                    continue;
                };
                let Ok(ws_msg) = serde_json::from_str::<WsMessage>(&text) else {
                    eprintln!("Invalid JSON from {uuid}: {text}");
                    continue;
                };

                let roomkey = ws_msg.get_key();

                match ws_msg {
                    WsMessage::Subscribe(_) => {
                        registry.entry(roomkey)
                            .or_insert_with(DashMap::new)
                            .insert(uuid, tx.clone());
                    }
                    WsMessage::Unsubscribe(_) => {
                        if let Some(room) = registry.get_mut(&roomkey) {
                            room.remove(&uuid);
                        }
                    }
                    WsMessage::KillThread(_) => {
                        registry.remove(&roomkey);
                    },
                    WsMessage::Notification { .. } => {
                        let Some(payload) = ws_msg.into_message() else {
                            eprintln!("Wrong message type from {uuid}");
                            continue;
                        };
                        if let Some(room) = registry.get(&roomkey) {
                            room.iter()
                                .filter(|entry| *entry.key() != uuid)
                                .for_each(|entry| { let _ = entry.value().send(payload.clone());
                            });
                        }
                    }
                }
            }
            internal_msg = rx.recv() => {
                let Some(msg) = internal_msg else { break };
                if ws_sender.send(msg).await.is_err() {
                    break;
                }
            }
        }
    }
    registry.iter_mut().for_each(|mut entry| {
        entry.value_mut().remove(&uuid);
    });
    println!("Connection closed");
}
