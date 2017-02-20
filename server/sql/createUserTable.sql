CREATE TABLE IF NOT EXISTS "Users"(
    id serial primary key,
    email text not null,
    password text not null,
    tokens jsonb,
    UNIQUE(email)
);
CREATE INDEX IF NOT EXISTS "Users_tokens_gin_idx"
ON "Users" 
USING gin (tokens jsonb_path_ops);