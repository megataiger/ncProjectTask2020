package com.example.dao;

import com.example.entities.CalendarDay;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarDayRepo extends PagingAndSortingRepository<CalendarDay, Integer> {
}
