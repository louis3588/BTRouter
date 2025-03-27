package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.RouterOrderService;
import cf.ac.uk.btrouter.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class DataExportController {

    private final UserService userService;
    private final RouterOrderService routerOrderService;

    public DataExportController(UserService userService, RouterOrderService routerOrderService) {
        this.userService = userService;
        this.routerOrderService = routerOrderService;
    }
    @GetMapping("/export")
    public void exportDataAsCSV(HttpServletResponse response, Authentication authentication) throws IOException {
        String email = authentication.getName();
        User user = userService.findByEmail(email);
        List<Order> orders = routerOrderService.getOrdersByEmail(email);

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"bt-data-export.csv\"");

        try (PrintWriter writer = response.getWriter()) {
            writer.println("=== USER DETAILS ===");
            writer.println("Email,First Name,Last Name,Phone Number,Business Type,VAT Number,Billing Address,2FA,Order Updates,Billing Notifs,Marketing Emails");

            writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%b,%b,%b,%b\n",
                    user.getEmail(), user.getFirstName(), user.getLastName(), user.getPhoneNumber(),
                    user.getBusinessType(), user.getVatNumber(), user.getBillingAddress(),
                    user.isTwoFactorAuth(), user.isOrderUpdates(), user.isBillingNotifications(), user.isMarketingEmails());

            writer.println();
            writer.println("=== ORDER HISTORY ===");
            writer.println("Order Date,Router Type,Customer Type,Num Routers,Site Name,Address,Postcode,Primary Email,Secondary Email,Phone,Contact,Priority");

            for (Order order : orders) {
                writer.printf("\"%s\",\"%s\",\"%s\",%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                        order.getOrderDate(), order.getRouterType(), order.getCustomerType(), order.getNumberOfRouters(),
                        order.getSiteName(), order.getAddress(), order.getPostcode(),
                        order.getSitePrimaryEmail(), order.getSiteSecondaryEmail(),
                        order.getPhoneNumber(), order.getSiteContactName(), order.getPriorityLevel());
            }
        }
    }

}
