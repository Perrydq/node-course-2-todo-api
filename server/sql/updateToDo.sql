UPDATE "ToDo" 
SET "todo" = ${toDoText}
WHERE "id" = ${toDoId} 
AND creator = ${creator}
RETURNING *