package com.example.entities;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "birthday")
    private LocalDate birthday;

    @Column(name = "work_position")
    private String workPosition;

    public Employee() {
    }

    public Employee(String name, LocalDate birthday, String workPosition) {
        this.name = name;
        this.birthday = birthday;
        this.workPosition = workPosition;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String getWorkPosition() {
        return workPosition;
    }

    public void setWorkPosition(String workPosition) {
        this.workPosition = workPosition;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", birthday=" + birthday +
                ", workPosition='" + workPosition + '\'' +
                '}';
    }
}
