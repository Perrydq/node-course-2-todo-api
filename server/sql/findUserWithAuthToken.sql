SELECT *
FROM "Users" 
WHERE tokens @> concat('[{"token": "',${token},'"}]')::jsonb
AND tokens @> '[{"access": "auth"}]'
AND id = ${id}