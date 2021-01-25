package com.example.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "film_session")
public class FilmSession {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "film_id")
    private Film film;

    private String timeBegin;

    private Double price;

    private int room;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "calendar_day_session",
            joinColumns = @JoinColumn(name = "film_session_id"),
            inverseJoinColumns = @JoinColumn(name = "calendar_day_id"))
    private List<CalendarDay> calendarDayList;

    public FilmSession() {
    }

    public FilmSession(Film film, String timeBegin, Double price, int room) {
        this.film = film;
        this.timeBegin = timeBegin;
        this.price = price;
        this.room = room;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Film getFilm() {
        return film;
    }

    public void setFilm(Film film) {
        this.film = film;
    }

    public String getFilmName() {
        return film.getName();
    }

    public String getTimeBegin() {
        return timeBegin;
    }

    public void setTimeBegin(String timeBegin) {
        this.timeBegin = timeBegin;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public int getRoom() {
        return room;
    }

    public void setRoom(int room) {
        this.room = room;
    }

    public List<CalendarDay> getCalendarDayList() {
        return calendarDayList;
    }

    public void setCalendarDayList(List<CalendarDay> calendarDayList) {
        this.calendarDayList = calendarDayList;
    }
}
