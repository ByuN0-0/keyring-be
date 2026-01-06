-- Migration number: 0003 	 2026-01-06T13:37:00Z
CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    parent_id TEXT, -- Null for root items
    name TEXT NOT NULL, -- Folder name or Item name
    type TEXT NOT NULL CHECK(type IN ('FOLDER', 'ITEM')),
    
    encrypted_blob TEXT, -- Stores the actual secret data
    salt TEXT, -- Global salt for this item if needed
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_items_parent ON items(parent_id);
CREATE INDEX idx_items_user ON items(user_id);
