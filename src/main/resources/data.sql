INSERT INTO employee (id, name, birthday, work_position) VALUES (1, 'Илья', '1984-05-15', 'Директор');
INSERT INTO employee (id, name, birthday, work_position) VALUES (2, 'Николай', '1989-10-27', 'Менеджер');
INSERT INTO employee (id, name, birthday, work_position) VALUES (3, 'Иван', '1999-06-10', 'Кассир');
INSERT INTO employee (id, name, birthday, work_position) VALUES (4, 'Сергей', '1998-01-05', 'Кассир');

INSERT INTO films (id, name, description, authors, main_actors, duration, category, age_rating)
    VALUES (1,
    'Серебряные коньки',
    '1899 год, рождественский Петербург. Яркая праздничная жизнь бурлит на скованных льдом реках и каналах столицы. Накануне нового столетия судьба сводит тех, кому, казалось бы, не суждено было встретиться. Люди из совершенно разных миров, Матвей - сын фонарщика, его единственное богатство - доставшиеся по наследству посеребренные коньки; Алиса - дочь крупного сановника, грезящая о науке. У каждого - своя непростая история, но, однажды столкнувшись, они устремляются к мечте вместе.',
    'Михаил Локшин',
    'Александра Ревенко, Юрий Борисов, Юрий Колокольников',
    '02:17',
    'Мелодрама, Приключения, Фэнтези, Экшн',
    6);
INSERT INTO films (id, name, description, authors, main_actors, duration, category, age_rating)
    VALUES (2,
    'Взаперти',
    'Гиперзаботливая мать Диана Шерман растит дочь Хлою в полной изоляции, контролируя каждый её шаг. Та прикована к инвалидному креслу, принимает множество таблеток, обучается дома и не общается со сверстниками. Разумеется, Хлоя растет наивной девушкой, но однажды она начинает подозревать что-то неладное.',
    'Аниш Чаганти',
    'Сара Полсон, Кира Аллен, Онали Эймс',
    '01:30',
    'Триллер',
    16);
INSERT INTO films (id, name, description, authors, main_actors, duration, category, age_rating)
    VALUES (3,
    'Назад в будущее',
    'Марти Макфлай — обычный школьник, живущий в 1980-е в маленьком американском городке с родителями-неудачниками и мечтающий стать рок-звездой. Однажды Марти звонит его друг — слегка безумный ученый по прозвищу Док, — который просит встретиться с ним ночью, чтобы показать нечто удивительное. Оказывается, Док изобрел машину времени, оснастив DeLorean DMC-12 устройством на плутониевом топливе. Внезапно на них нападают ливийские террористы, у которых Док украл плутоний, Марти случайно активирует машину времени — и попадает в 1955 год. Там ему придется найти способ вернуться в настоящее и попутно заставить своих родителей влюбиться друг в друга, иначе он сам просто перестанет существовать…',
    'Роберт Земекис',
    'Майкл Дж., Кристофер Ллойд, Лиа Томпсон',
    '01:56',
    'Комедия, Приключения, Фантастика',
    12);

INSERT INTO calendar_day (id, calendar_day) VALUES (1, '2020-12-15');
INSERT INTO calendar_day (id, calendar_day) VALUES (2, '2020-12-16');
INSERT INTO calendar_day (id, calendar_day) VALUES (3, '2020-12-17');

INSERT INTO film_session (id, film_id, time_begin, price, room) VALUES (1, 3, '11:00', 150.00, 1);
INSERT INTO film_session (id, film_id, time_begin, price, room) VALUES (2, 1, '11:15', 170.00, 2);
INSERT INTO film_session (id, film_id, time_begin, price, room) VALUES (3, 2, '18:00', 220.00, 1);
INSERT INTO film_session (id, film_id, time_begin, price, room) VALUES (4, 1, '18:15', 250.00, 2);

INSERT INTO tickets (id, film_session_id, show_day, time_sale, employee_id, row_room, place)
    VALUES(1, 1, 1, NOW(), 3, 3, 7);
INSERT INTO tickets (id, film_session_id, show_day, time_sale, employee_id, row_room, place)
    VALUES(2, 4, 1, NOW(), 3, 1, 7);
INSERT INTO tickets (id, film_session_id, show_day, time_sale, employee_id, row_room, place)
    VALUES(3, 4, 1, NOW(), 4, 15, 10);
INSERT INTO tickets (id, film_session_id, show_day, time_sale, employee_id, row_room, place)
    VALUES(4, 3, 1, NOW(), 4, 10, 3);

INSERT INTO calendar_day_session (calendar_day_id, film_session_id) VALUES (1, 1);
INSERT INTO calendar_day_session (calendar_day_id, film_session_id) VALUES (1, 2);
INSERT INTO calendar_day_session (calendar_day_id, film_session_id) VALUES (1, 3);
INSERT INTO calendar_day_session (calendar_day_id, film_session_id) VALUES (1, 4);
