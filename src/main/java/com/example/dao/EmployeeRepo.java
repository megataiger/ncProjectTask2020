package com.example.dao;

import com.example.entities.Employee;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

@Repository
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface EmployeeRepo extends PagingAndSortingRepository<Employee, Integer> {
}
