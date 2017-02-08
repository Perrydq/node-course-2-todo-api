CREATE TABLE IF NOT EXISTS "ToDo"(
    id serial primary key,
    todo text not null,
    completed BOOLEAN DEFAULT FALSE,
    completedAt timestamptz
);