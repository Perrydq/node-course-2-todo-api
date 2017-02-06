CREATE TABLE IF NOT EXISTS "Users"(
    id serial primary key NOT NULL,
    name text NOT NULL,
    age int NOT NULL,
    location text
)