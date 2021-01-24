package com.example.conrollers;

import com.google.gson.JsonObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class MainController {

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }

    @RequestMapping(value = "/getUserRole")
    @ResponseBody
    public JsonObject getUserRole(Authentication authentication) {
        JsonObject role = new JsonObject();
        if (authentication.isAuthenticated()) {
            role.addProperty("role", "USER");
            List<GrantedAuthority> grantedAuthorityList = new ArrayList<>(authentication.getAuthorities());
            for(GrantedAuthority gr: grantedAuthorityList) {
                if (gr.getAuthority().equals("ROLE_ADMIN")) {
                    role.addProperty("role", "ADMIN");
                }
            }
        }

        return role;
    }
}
