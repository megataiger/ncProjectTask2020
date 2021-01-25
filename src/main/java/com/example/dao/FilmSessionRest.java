package com.example.dao;

import com.example.entities.FilmSession;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(excerptProjection = FilmSessionProjection.class)
public interface FilmSessionRest extends CrudRepository<FilmSession, Integer> {
}
