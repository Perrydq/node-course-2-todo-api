CREATE TABLE IF NOT EXISTS "Users"(
    id serial primary key,
    email text not null,
    password text not null,
    tokens json [],
    UNIQUE(email)
);