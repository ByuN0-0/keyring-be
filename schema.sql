CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vault_scopes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    scope TEXT CHECK(scope IN ('global', 'provider', 'project')) NOT NULL,
    scope_id TEXT, -- e.g., provider name or project id
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS vault_fragments (
    scope_pk TEXT PRIMARY KEY, -- This could be the scope id or a composite key
    user_id TEXT NOT NULL,
    encrypted_blob TEXT NOT NULL,
    salt TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
