package com.example.xml;

import com.example.entities.Employee;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Megtaiger on 23.01.2021.
 */
public class EmployeeXmlImport {

    public static List<Employee> importEmployeeFromXml(Document doc) {
        List<Employee> employees = new ArrayList<>();

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
                employees.add(employeeTemp);
            }
        }

        return employees;
    }
}
