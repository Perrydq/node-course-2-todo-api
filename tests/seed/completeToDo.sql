UPDATE "ToDo" 
SET completed = true,
    completedAt = NOW()
WHERE "id" = ${toDoId} 
RETURNING *