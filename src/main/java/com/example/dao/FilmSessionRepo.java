package com.example.dao;

import com.example.entities.FilmSession;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilmSessionRepo extends PagingAndSortingRepository<FilmSession, Integer> {
}
