UPDATE "ToDo" 
SET "todo" = ${toDoText}
WHERE "id" = ${toDoId} 
RETURNING *