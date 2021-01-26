package com.example.repositories;

import com.example.entities.FilmSession;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "filmSession", types = { FilmSession.class })
public interface FilmSessionProjection {
    String getTimeBegin();
    Double getPrice();
    int getRoom();
    String getFilmName();
}
