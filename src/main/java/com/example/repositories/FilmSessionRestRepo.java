package com.example.repositories;

import com.example.entities.FilmSession;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(excerptProjection = FilmSessionProjection.class)
public interface FilmSessionRestRepo extends PagingAndSortingRepository<FilmSession, Integer> {
}
