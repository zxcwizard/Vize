use axum::extract::ws::{Message, WebSocket};
use axum::extract::WebSocketUpgrade;
use axum::response::Response;
use axum::routing::get;
use axum::Router;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/ws", get(handler))
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:4000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(result) = socket.recv().await {
        match result {
            Ok(msg) => {
                match msg {
                    Message::Text(text) => {
                        socket
                            .send(Message::Text(format!("Echo: {}", text).into()))
                            .await
                            .unwrap();
                        println!("Received Text: {}", text);
                    }
                    Message::Close(_) => {
                        println!("Client requested closure");
                        break;
                    }
                    _ => {}
                }
            }
            Err(e) => {
                eprintln!("WebSocket error: {:?}", e);
                break;
            }
        }
    }
    println!("Connection closed safely.");
}
