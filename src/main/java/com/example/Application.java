package com.example;

import com.example.dao.*;
import com.example.entities.Employee;
import com.example.entities.Role;
import com.example.entities.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.annotation.PostConstruct;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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
    private FilmSessionRepo filmSessionRepo;
    private TicketRepo ticketRepo;
    private CalendarDayRepo calendarDayRepo;
    private EmployeeRepo employeeRepo;

    @Autowired
    public InsertData(UserRepo userRepo,
                      FilmRepo filmRepo,
                      FilmSessionRepo filmSessionRepo,
                      TicketRepo ticketRepo,
                      CalendarDayRepo calendarDayRepo,
                      EmployeeRepo employeeRepo) {
        this.userRepo = userRepo;
        this.filmRepo = filmRepo;
        this.filmSessionRepo = filmSessionRepo;
        this.ticketRepo = ticketRepo;
        this.calendarDayRepo = calendarDayRepo;
        this.employeeRepo = employeeRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            String filepath = "src/main/resources/dataxml/data.xml";
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            Document doc = docBuilder.parse(filepath);

            NodeList userList = doc.getElementsByTagName("user");
            for (int i = 0; i < userList.getLength(); i++) {
                User userTemp = new User();
                Node user = userList.item(i);
                NodeList fields = user.getChildNodes();
                for (int j = 0; j < fields.getLength(); j++) {
                    Node field = fields.item(j);
                    if (field.getNodeType() == Node.ELEMENT_NODE) {
                        switch (field.getNodeName()) {
                            case "username":
                                userTemp.setUsername(field.getTextContent());
                                break;
                            case "password":
                                userTemp.setPassword(field.getTextContent());
                                break;
                            case "active":
                                userTemp.setActive(Boolean.parseBoolean(field.getTextContent()));
                                break;
                            case "roles":
                            {
                                NodeList roles = field.getChildNodes();
                                Set<Role> roleSet = new HashSet<>();
                                for (int k = 0; k < roles.getLength(); k++) {
                                    Node role = roles.item(k);
                                    if (role.getNodeType() == Node.ELEMENT_NODE) {
                                        roleSet.add(Role.valueOf(role.getTextContent()));
                                    }
                                }
                                userTemp.setRoles(roleSet);
                            }
                                break;
                        }
                    }
                }

                if (userTemp.getUsername() != null && userTemp.getPassword() != null && userTemp.getRoles() != null) {
                    userRepo.save(userTemp);
                }
            }

            NodeList employeeList = doc.getElementsByTagName("employee");
            for (int i = 0; i < employeeList.getLength(); i++) {
                Employee employeeTemp = new Employee();
                Node employee = employeeList.item(i);
                NodeList fields = employee.getChildNodes();
                for (int j = 0; j < fields.getLength(); j++) {
                    Node field = fields.item(j);
                    if (field.getNodeType() == Node.ELEMENT_NODE) {
                        switch (field.getNodeName()) {
                            case "name":
                                employeeTemp.setName(field.getTextContent());
                                break;
                            case "birthday":
                                employeeTemp.setBirthday(LocalDate.parse(field.getTextContent()));
                                break;
                            case "workPosition":
                                employeeTemp.setWorkPosition(field.getTextContent());
                                break;
                        }
                    }
                }
                if (employeeTemp.getBirthday() != null &&
                        employeeTemp.getName() != null &&
                        employeeTemp.getWorkPosition() != null) {
                    employeeRepo.save(employeeTemp);
                }
            }
        } catch (ParserConfigurationException | IOException e) {
            e.printStackTrace();
        }
    }
}