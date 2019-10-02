create table projects (
    id   integer primary key autoincrement,
    name varchar(255),
    repo varchar(255)
);

create table sprints (
    id         integer primary key autoincrement,
    title      varchar(255),
    date_from  timestamp,
    date_to    timestamp,
    project_id integer
);

create table milestones (
    id        integer primary key autoincrement,
    title     varchar(255),
    sprint_id integer
);