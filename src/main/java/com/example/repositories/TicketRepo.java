package com.example.repositories;

import com.example.entities.Ticket;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepo extends PagingAndSortingRepository<Ticket, Integer> {
}
