package com.example.conrollers;

import com.example.dao.BaseRepoImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    private BaseRepoImpl baseRepoImpl;

    @Autowired
    public MainController(BaseRepoImpl baseRepoImpl) {
        this.baseRepoImpl = baseRepoImpl;
    }

    @GetMapping("/")
    public String getHello() {

        return "hello";
    }
}
