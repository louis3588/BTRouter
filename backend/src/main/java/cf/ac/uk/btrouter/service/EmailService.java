package cf.ac.uk.btrouter.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import cf.ac.uk.btrouter.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Send password reset email with token
    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link below:\n\n" +
                "http://localhost:3000/reset-password?token=" + token + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you did not request a password reset, please ignore this email.");
        mailSender.send(message);
    }

    // Send order confirmation email with tracking reference
    public void sendOrderConfirmationEmail(String to, String referenceNumber, Order order) {
        logger.info("Sending order confirmation email to: {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("BT Router Order Confirmation - Ref: " + referenceNumber);
        String trackingUrl = frontendUrl + "/order-tracking/" + referenceNumber;
        String emailBody = String.format("""
            Thank you for your router order!
            
            Order Reference: %s
            Order Status: Pending
            
            Order Details:
            - Router Type: %s
            - Quantity: %d
            - Site Name: %s
            - Delivery Address: %s
            - Postcode: %s
            
            Important Timeframes:
            - Order modifications and cancellations allowed until order is approved/confirmed
            - Estimated production time: 3-5 business days
            - Estimated delivery time: 5-7 business days
            
            Track your order here: %s
            
            If you need any assistance, please contact our support team.
            
            Best regards,
            BT IoT Router Services Team
            """,
                referenceNumber,
                order.getRouterType(),
                order.getNumRouters(),
                order.getSiteName(),
                order.getSiteAddress(),
                order.getSitePostcode(),
                trackingUrl
        );
        message.setText(emailBody);
        try {
            mailSender.send(message);
            logger.info("Order confirmation email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email to: {}", to, e);
            throw e;
        }
    }

    // Send order modification confirmation email
    public void sendOrderModificationEmail(String to, String referenceNumber, Order order) {
        logger.info("Sending order modification email to: {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("BT Router Order Modified - Ref: " + referenceNumber);
        String trackingUrl = frontendUrl + "/order-tracking/" + referenceNumber;
        String emailBody = String.format("""
            Your order has been successfully modified.
            
            Order Reference: %s
            
            Updated Order Details:
            - Router Type: %s
            - Quantity: %d
            - Site Name: %s
            
            Track your order here: %s
            
            If you did not make these changes, please contact our support team immediately.
            
            Best regards,
            BT IoT Router Services Team
            """,
                referenceNumber,
                order.getRouterType(),
                order.getNumRouters(),
                order.getSiteName(),
                trackingUrl
        );
        message.setText(emailBody);
        try {
            mailSender.send(message);
            logger.info("Order modification email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send order modification email to: {}", to, e);
            throw e;
        }
    }

    // Send order cancellation confirmation email
    public void sendOrderCancellationEmail(String to, String referenceNumber) {
        logger.info("Sending order cancellation email to: {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("BT Router Order Cancelled - Ref: " + referenceNumber);
        String emailBody = String.format("""
            Your order has been successfully cancelled.
            
            Order Reference: %s
            
            A refund will be processed within 3-5 business days. 
            If you did not request this cancellation, please contact our support team immediately.
            
            Best regards,
            BT IoT Router Services Team
            """,
                referenceNumber
        );
        message.setText(emailBody);
        try {
            mailSender.send(message);
            logger.info("Order cancellation email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send order cancellation email to: {}", to, e);
            throw e;
        }
    }

    // Send order status update email with additional context for each status
    public void sendOrderStatusUpdateEmail(String to, String referenceNumber, String newStatus) {
        logger.info("Sending status update email to: {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("BT Router Order Status Update - Ref: " + referenceNumber);
        String trackingUrl = frontendUrl + "/order-tracking/" + referenceNumber;
        String statusDetails;
        switch(newStatus) {
            case "PENDING":
                statusDetails = "Your order is pending and awaiting further processing.";
                break;
            case "CONFIRMED":
                statusDetails = "Your order has been confirmed and will soon be sent to production.";
                break;
            case "IN_PRODUCTION":
                statusDetails = "Your order is currently in production. Production is expected to complete within 3-5 business days.";
                break;
            case "QUALITY_CHECK":
                statusDetails = "Your order is undergoing quality checks. This process may take up to 48 hours before moving to the next stage.";
                break;
            case "READY_FOR_SHIPPING":
                statusDetails = "Your order is ready for shipping. Please expect dispatch shortly.";
                break;
            case "IN_TRANSIT":
                statusDetails = "Your order is in transit. Estimated delivery is within 3-5 business days.";
                break;
            case "DELIVERED":
                statusDetails = "Your order has been delivered. We hope you enjoy your new router.";
                break;
            case "CANCELLED":
                statusDetails = "Your order has been cancelled. A refund will be processed within 3-5 business days.";
                break;
            default:
                statusDetails = "Your order status has been updated.";
                break;
        }
        String emailBody = String.format("""
            Your order status has been updated.
            
            Order Reference: %s
            
            %s
            
            Track your order here: %s
            
            Best regards,
            BT IoT Router Services Team
            """,
                referenceNumber,
                statusDetails,
                trackingUrl
        );
        message.setText(emailBody);
        try {
            mailSender.send(message);
            logger.info("Status update email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send status update email to: {}", to, e);
            throw e;
        }
    }
}
