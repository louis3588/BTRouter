package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.UserService;
import cf.ac.uk.btrouter.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{email}")
    public UserDTO getUserByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);
        return new UserDTO(user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().toString());
    }

    // Add other methods for your UserController as needed
}