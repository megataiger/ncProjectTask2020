CREATE TABLE films (
    id   INTEGER      NOT NULL AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL UNIQUE,
    description TEXT,
    authors VARCHAR(128),
    main_actors VARCHAR(256),
    duration VARCHAR(5),
    category VARCHAR(100),
    age_rating INTEGER(2),

    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(256) NOT NULL,
    birthday DATE,
    work_position VARCHAR(128),

    PRIMARY KEY (id)
);

CREATE TABLE calendar_day (
    id INTEGER NOT NULL AUTO_INCREMENT,
    calendar_day DATE,

    PRIMARY KEY (id)
);

CREATE TABLE film_session (
    id INTEGER NOT NULL AUTO_INCREMENT,
    film_id INTEGER NOT NULL,
    time_begin VARCHAR(5),
    price FLOAT,
    room INTEGER,

    FOREIGN KEY (film_id) REFERENCES films(id)
);

CREATE TABLE tickets (
    id INTEGER NOT NULL AUTO_INCREMENT,
    film_session_id INTEGER NOT NULL,
    show_day INTEGER NOT NULL,
    time_sale DATE NOT NULL,
    employee_id INTEGER NOT NULL,
    row_room INTEGER(2),
    place INTEGER(2),

    FOREIGN KEY (film_session_id) REFERENCES film_session(id),
    FOREIGN KEY (show_day) REFERENCES calendar_day(id),
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);

CREATE TABLE calendar_day_session (
    calendar_day_id INTEGER NOT NULL,
    film_session_id INTEGER NOT NULL,

    FOREIGN KEY (calendar_day_id) REFERENCES calendar_day(id),
    FOREIGN KEY (film_session_id) REFERENCES film_session(id)
);