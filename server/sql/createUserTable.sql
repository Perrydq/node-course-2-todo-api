CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "Users"(
    id uuid primary key DEFAULT uuid_generate_v4 (),
    email text unique not null,
    password text not null,
    tokens jsonb,
    UNIQUE(email)
);

CREATE INDEX IF NOT EXISTS "Users_tokens_gin_idx"
ON "Users" 
USING gin (tokens jsonb_path_ops);