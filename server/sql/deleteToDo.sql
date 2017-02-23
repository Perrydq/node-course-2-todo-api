DELETE FROM "ToDo" 
WHERE "id" = ${toDoId}
AND creator = ${creator}
RETURNING *