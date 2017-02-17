UPDATE "Users" 
SET "tokens" = ${tokens}::json[]
WHERE "id" = ${id} 
RETURNING *