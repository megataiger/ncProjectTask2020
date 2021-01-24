package com.example;

import com.example.dao.CalendarDayRepo;
import com.example.dao.EmployeeRepo;
import com.example.dao.FilmRepo;
import com.example.dao.UserRepo;
import com.example.entities.CalendarDay;
import com.example.entities.Employee;
import com.example.entities.Film;
import com.example.entities.User;
import com.example.xml.EmployeeXmlImport;
import com.example.xml.FilmXmlImport;
import com.example.xml.UserXmlImport;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;

import javax.annotation.PostConstruct;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class Application {
    @Autowired
    private ObjectMapper objectMapper;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @PostConstruct
    public void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
    }
}

@Component
class InsertData implements CommandLineRunner {

    private UserRepo userRepo;
    private FilmRepo filmRepo;
    private EmployeeRepo employeeRepo;
    private CalendarDayRepo calendarDayRepo;

    @Autowired
    public InsertData(UserRepo userRepo,
                      FilmRepo filmRepo,
                      EmployeeRepo employeeRepo,
                      CalendarDayRepo calendarDayRepo) {
        this.userRepo = userRepo;
        this.filmRepo = filmRepo;
        this.employeeRepo = employeeRepo;
        this.calendarDayRepo = calendarDayRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            String filepath = "src/main/resources/dataxml/data.xml";
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            Document doc = docBuilder.parse(filepath);

            List<User> users = UserXmlImport.importUsersFromXml(doc);
            userRepo.saveAll(users);

            List<Employee> employees = EmployeeXmlImport.importEmployeeFromXml(doc);
            employeeRepo.saveAll(employees);

            List<Film> films = FilmXmlImport.importFilmFromXml(doc);
            filmRepo.saveAll(films);
        } catch (ParserConfigurationException | IOException e) {
            e.printStackTrace();
        }
    }
}