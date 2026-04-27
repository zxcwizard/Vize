use serde::{Deserialize, Serialize};

#[derive(Hash, Eq, PartialEq, Clone, Copy, Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Board {
    Pol,
    Biz,
    Mu,
    Tech,
    G,
    Test,
}
