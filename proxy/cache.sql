create table responses (
    url varchar(255) primary key,
    header text,
    body text,
    updated_at timestamp
);