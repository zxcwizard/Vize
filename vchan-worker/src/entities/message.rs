use crate::entities::room_key::RoomKey;
use axum::extract::ws::Message;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", content = "data")]
pub enum WsMessage {
    Subscribe(RoomKey),
    Unsubscribe(RoomKey),
    KillThread(RoomKey),
    Notification {
        #[serde(flatten)]
        key: RoomKey,
        payload: String,
    },
}

impl WsMessage {
    pub fn get_key(&self) -> RoomKey {
        match self {
            WsMessage::Subscribe(k)
            | WsMessage::Unsubscribe(k)
            | WsMessage::KillThread(k)
            | WsMessage::Notification { key: k, .. } => *k,
        }
    }
}
impl WsMessage {
    pub fn into_message(self) -> Option<Message> {
        match self {
            WsMessage::Notification { .. } => {
                let json = serde_json::to_string(&self).unwrap_or_else(|_| "{}".to_string());
                Some(Message::Text(json.into()))
            }
            _ => None,
        }
    }
}
