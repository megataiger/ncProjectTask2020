package com.example.dao;

import com.example.entities.Film;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilmRepo extends PagingAndSortingRepository<Film, Integer> {

    Film getFilmByName(String name);
}
