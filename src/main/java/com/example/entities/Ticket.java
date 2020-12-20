package com.example.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "film_session_id")
    private FilmSession filmSession;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "show_day")
    private CalendarDay showDay;

    private LocalDateTime timeSale;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private int rowRoom;

    private int place;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public FilmSession getFilmSession() {
        return filmSession;
    }

    public void setFilmSession(FilmSession filmSession) {
        this.filmSession = filmSession;
    }

    public CalendarDay getShowDay() {
        return showDay;
    }

    public void setShowDay(CalendarDay showDay) {
        this.showDay = showDay;
    }

    public LocalDateTime getTimeSale() {
        return timeSale;
    }

    public void setTimeSale(LocalDateTime timeSale) {
        this.timeSale = timeSale;
    }

    public int getRowRoom() {
        return rowRoom;
    }

    public void setRowRoom(int rowRoom) {
        this.rowRoom = rowRoom;
    }

    public int getPlace() {
        return place;
    }

    public void setPlace(int place) {
        this.place = place;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
