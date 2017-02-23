CREATE TABLE IF NOT EXISTS "ToDo"(
    id serial primary key,
    todo text not null,
    completed BOOLEAN DEFAULT FALSE,
    completedAt timestamp,
    creator uuid NOT NULL,
    FOREIGN KEY (creator) REFERENCES "Users"(id)
);