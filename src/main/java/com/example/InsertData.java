package com.example;

import com.example.repositories.CalendarDayRepo;
import com.example.repositories.EmployeeRepo;
import com.example.repositories.FilmRepo;
import com.example.repositories.UserRepo;
import com.example.entities.Employee;
import com.example.entities.Film;
import com.example.entities.User;
import com.example.xml.EmployeeXmlImport;
import com.example.xml.FilmXmlImport;
import com.example.xml.UserXmlImport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.List;

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
