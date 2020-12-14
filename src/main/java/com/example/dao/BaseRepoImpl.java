package com.example.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Component
public class BaseRepoImpl {

    @Autowired
    private EntityManager entityManager;

    public List<Object[]> select() {
        List<Object[]> resultList = new ArrayList<>();
        String query = "SELECT * FROM films";
        try {
            resultList = entityManager.createNativeQuery(query).getResultList();
        } catch (ClassCastException e) {
            e.printStackTrace();
        }
        return resultList;
    }
}
