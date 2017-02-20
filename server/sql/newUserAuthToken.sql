UPDATE "Users" 
SET "tokens" = ${tokens}::jsonb
WHERE "id" = ${id} 
RETURNING *