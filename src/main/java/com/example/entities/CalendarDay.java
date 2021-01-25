package com.example.entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "calendar_day")
public class CalendarDay {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private LocalDate calendarDay;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "calendar_day_session",
    joinColumns = @JoinColumn(name = "calendar_day_id"),
    inverseJoinColumns = @JoinColumn(name = "film_session_id"))
    private List<FilmSession> filmSessionList;

    public CalendarDay() {
    }

    public CalendarDay(LocalDate calendarDay) {
        this.calendarDay = calendarDay;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDate getCalendarDay() {
        return calendarDay;
    }

    public void setCalendarDay(LocalDate calendarDay) {
        this.calendarDay = calendarDay;
    }
    public List<FilmSession> getFilmSessionList() {
        return filmSessionList;
    }

    public void setFilmSessionList(List<FilmSession> filmSessionList) {
        this.filmSessionList = filmSessionList;
    }

    public void addFilmSessionList(FilmSession filmSession) {
        this.filmSessionList.add(filmSession);
    }

    public void removeFilmSessionList(FilmSession filmSession) {
        this.filmSessionList.remove(filmSession);
    }
}
