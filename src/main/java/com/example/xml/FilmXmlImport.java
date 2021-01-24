package com.example.xml;

import com.example.entities.Film;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Megtaiger on 23.01.2021.
 */
public class FilmXmlImport {

    public static List<Film> importFilmFromXml(Document doc) {
        List<Film> films = new ArrayList<>();

        NodeList filmList = doc.getElementsByTagName("film");
        for (int i = 0; i < filmList.getLength(); i++) {
            Film filmTemp = new Film();
            Node film = filmList.item(i);
            NodeList fields = film.getChildNodes();
            for (int j = 0; j < fields.getLength(); j++) {
                Node field = fields.item(j);
                if (field.getNodeType() == Node.ELEMENT_NODE) {
                    switch (field.getNodeName()) {
                        case "name":
                            filmTemp.setName(field.getTextContent());
                            break;
                        case "description":
                            filmTemp.setDescription(field.getTextContent());
                            break;
                        case "authors":
                            filmTemp.setAuthors(field.getTextContent());
                            break;
                        case "main_actors":
                            filmTemp.setMainActors(field.getTextContent());
                            break;
                        case "duration":
                            filmTemp.setDuration(field.getTextContent());
                            break;
                        case "category":
                            filmTemp.setCategory(field.getTextContent());
                            break;
                        case "age_rating":
                            filmTemp.setAgeRating(Integer.parseInt(field.getTextContent()));
                            break;
                    }
                }
            }

            if (filmTemp.getName() != null && filmTemp.getDescription() != null && filmTemp.getAuthors() != null
                    && filmTemp.getMainActors() != null && filmTemp.getDuration() != null
                    && filmTemp.getCategory() != null && filmTemp.getAgeRating() != 0) {
                films.add(filmTemp);
            }
        }

        return films;
    }
}
