package Thalassa.Controllers;

import Thalassa.DataManagement.Services.UserService;
import Thalassa.DataManagement.Utils;
import Thalassa.Models.User;
import Thalassa.DataManagement.Services.CryptographyService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@Controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping({"/", "/index", "/home"})
    public String index() {
        return "index";
    }

    @GetMapping("/welcome")
    public String welcomePage() {
        return "welcome";
    }

    // Checks if anyone is logged in
    @GetMapping("/isLoggedIn")
    public @ResponseBody boolean isLoggedIn(HttpSession session) {
        return session.getAttribute("loggedInPrivateKey") != null;
    }

    // Checks if the e-mail provided by the user during registration already exists and returns boolean
    @PostMapping("/emailExists")
    public @ResponseBody boolean emailExists(@RequestBody String email) {
        return userService.findByEmail(email) != null;
    }

    // Generates user’s public and private keys
    @PostMapping("/generateKeys")
    public String generateKeys(@ModelAttribute("user") User user, ModelMap model) {
        String[] keys;
        // Generate keys and check if public key is already used
        do keys = CryptographyService.generateKeys();
        while (userService.findByPublicKey(keys[0]) != null);
        model.addAttribute("publicKey", keys[0]);
        model.addAttribute("privateKey", keys[1]);

        return "generatedKeys";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    // Validates registration form before final registration
    @GetMapping("/registerIsValid")
    public @ResponseBody boolean registerIsValid(@Valid @ModelAttribute("user") User user, BindingResult bindingResult, Errors errors) {
        if (user.getEmail().length() > 0)
            if (userService.findByEmail(user.getEmail()) != null)
                errors.rejectValue("email", "error.emailAlreadyInUse");
        return !bindingResult.hasErrors();
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("user") User user, BindingResult bindingResult, Errors errors, ModelMap model, HttpSession session) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "publicKey", "error.requiredPublicKey");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "privateKey", "error.requiredPrivateKey");
        if (user.getEmail().length() > 0)
            if (userService.findByEmail(user.getEmail()) != null)
                errors.rejectValue("email", "error.emailAlreadyInUse");

        if (bindingResult.hasErrors()) {
            model.addAttribute("status", "error");
            return "register";
        } else {
            session.setAttribute("loggedInPrivateKey", user.getPrivateKey());
            session.setAttribute("position", user.getPosition());
            model.addAttribute("status", "success");
            userService.save(user);

            return "redirect:/dashboard";
        }
    }

    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute("user") User user, BindingResult bindingResult, Errors errors, ModelMap model, HttpSession session) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "privateKey", "error.requiredPrivateKey");
        if (user.getPrivateKey() != null) {
            if (user.getPrivateKey().matches("^[0-9a-fA-F]+$") && user.getPrivateKey().length() % 2 == 0) {
                try {
                    if (userService.findByPublicKey(CryptographyService.getPublicKeyFromPrivate(user.getPrivateKey())) == null)
                        errors.rejectValue("privateKey", "error.noUserWithSuchCredentials");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else
                errors.rejectValue("privateKey", "error.privateKeyInvalid");
        }

        if (bindingResult.hasErrors()) {
            model.addAttribute("status", "error");
            return "login";
        } else {
            session.setAttribute("loggedInPrivateKey", user.getPrivateKey());
            session.setAttribute("position", user.getPosition());
            model.addAttribute("status", "success");
            return "redirect:/dashboard";
        }
    }

    @GetMapping("/dashboard")
    public String dashboard(ModelMap model, HttpSession session) {
        String privateKey = (String) session.getAttribute("loggedInPrivateKey");
        User user = userService.findByPublicKey(CryptographyService.getPublicKeyFromPrivate(privateKey));
        String firstName = user.getFirstName();
        String position = Utils.toPascalCase(user.getPosition());
        model.addAttribute("status", "success");
        model.addAttribute("firstName", firstName);
        return "dashboards/" + position + "/dashboard" + position;
    }

    // Returns right navbar section after login
    @GetMapping("/rightNavLogin")
    public String renderRightNavLogin() {
        return "navbar/rightNavLogin";
    }

    // Returns right navbar section after logout
    @GetMapping("/rightNavLogout")
    public String renderRightNavLogout() {
        return "navbar/mainRightNav";
    }

    // Adjusts navbar after logout
    @GetMapping("/logout")
    public String renderNavbarLogout(HttpSession session) {
        session.invalidate();
        return "navbar/mainNavbar";
    }

    // Returns basic navbar (when no one is logged in)
    @GetMapping("/navbarRegisterLogin")
    public String navbarRegisterLogin() {
        return "navbar/navbarRegisterLogin";
    }

    // Returns logged in user’s navbar (if no one is logged in, returns register-login navbar)
    @GetMapping("/userNavbar")
    public String userNavbar(HttpSession session) {
        String privateKey = (String) session.getAttribute("loggedInPrivateKey");
        if (privateKey == null)
            return "navbar/navbarRegisterLogin";
        else {
            User user = userService.findByPublicKey(CryptographyService.getPublicKeyFromPrivate(privateKey));
            return "navbar/navbar" + Utils.toPascalCase(user.getPosition());
        }
    }
}