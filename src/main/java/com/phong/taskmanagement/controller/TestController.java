package com.phong.taskmanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/dummy-test-endpoint")
    public String hello() {
        return "Hello Dummy";
    }
}
