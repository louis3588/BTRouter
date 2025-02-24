package cf.ac.uk.btrouter.controllers;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access backend
@RestController
@RequestMapping("/api")

public class HelloWorldController {

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello World";
    }
}
