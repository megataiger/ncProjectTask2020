package com.example.xml;

import com.example.entities.Role;
import com.example.entities.User;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Megtaiger on 23.01.2021.
 */
public class UserXmlImport {

    public static List<User> importUsersFromXml(Document doc) {
        List<User> users = new ArrayList<>();

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
                        case "roles": {
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
                users.add(userTemp);
            }
        }

        return users;
    }
}
