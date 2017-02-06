CREATE TABLE IF NOT EXISTS ${tableName~}(
    ${columnThreeName~} serial primary key NOT NULL,
    ${columnOneName~} text NOT NULL,
    ${columnTwoName~} boolean default false
)