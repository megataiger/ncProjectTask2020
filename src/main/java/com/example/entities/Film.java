package com.example.entities;

import javax.persistence.*;

@Entity
@Table(name = "films")
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String name;

    @Lob
    private String description;

    private String authors;

    private String mainActors;

    private String duration;

    private String category;

    private int ageRating;

    public Film() {
    }

    public Film(String name, String description, String authors, String mainActors, String duration, String category, int ageRating) {
        this.name = name;
        this.description = description;
        this.authors = authors;
        this.mainActors = mainActors;
        this.duration = duration;
        this.category = category;
        this.ageRating = ageRating;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuthors() {
        return authors;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }

    public String getMainActors() {
        return mainActors;
    }

    public void setMainActors(String mainActors) {
        this.mainActors = mainActors;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getAgeRating() {
        return ageRating;
    }

    public void setAgeRating(int ageRating) {
        this.ageRating = ageRating;
    }
}
