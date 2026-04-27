use crate::entities::board::Board;
use serde::{Deserialize, Serialize};

#[derive(Hash, Eq, PartialEq, Clone, Copy, Debug, Serialize, Deserialize)]
pub struct RoomKey {
    pub board: Board,
    pub thread: u32,
}
