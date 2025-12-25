-- Migration number: 0002 	 2025-12-25T10:00:00.000Z
ALTER TABLE vault_scopes ADD COLUMN sort_order INTEGER DEFAULT 0;
