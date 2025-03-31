package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.dto.ContactFormDTO;
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
        // Create email message
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("Password Reset Request");

        // Construct email body with reset link
        message.setText("To reset your password, click the link below:\n\n" +
                "http://localhost:3000/reset-password?token=" + token + "\n\n" +
                "This link will expire in 5 minutes.\n\n" +
                "If you did not request a password reset, please ignore this email.");

        // Send the email
        mailSender.send(message);
    }

    // Send order confirmation email with tracking reference
    public void sendOrderConfirmationEmail(String to, String referenceNumber, Order order) {
        logger.info("Sending order confirmation email to: {}", to);

        // Create email message
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("BT Router Order Confirmation - Ref: " + referenceNumber);

        // Construct tracking URL
        String trackingUrl = frontendUrl + "/track-order/" + referenceNumber;

        // Construct email body with order details and tracking info
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
            - Order modifications allowed within 24 hours
            - Order cancellation allowed before production stage
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

        // Create email message
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("BT Router Order Modified - Ref: " + referenceNumber);

        // Construct tracking URL
        String trackingUrl = frontendUrl + "/track-order/" + referenceNumber;

        // Construct email body with updated order details
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

        // Create email message
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("BT Router Order Cancelled - Ref: " + referenceNumber);

        // Construct email body for cancellation
        String emailBody = String.format("""
            Your order has been successfully cancelled.
            
            Order Reference: %s
            
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

    // Send order status update email
    public void sendOrderStatusUpdateEmail(String to, String referenceNumber, String newStatus) {
        logger.info("Sending status update email to: {}", to);

        // Create email message
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ttgzee123@gmail.com");
        message.setTo(to);
        message.setSubject("BT Router Order Status Update - Ref: " + referenceNumber);

        // Construct tracking URL
        String trackingUrl = frontendUrl + "/track-order/" + referenceNumber;

        // Construct email body for status update
        String emailBody = String.format("""
            Your order status has been updated.
            
            Order Reference: %s
            New Status: %s
            
            Track your order here: %s
            
            Best regards,
            BT IoT Router Services Team
            """,
                referenceNumber,
                newStatus,
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

    //Contact Us Form Submission
    public void sendContactFormEmail(ContactFormDTO contactForm) {
        logger.info("Sending contact form email from: {}", contactForm.getEmail());

        // Send to support team
        SimpleMailMessage supportMessage = new SimpleMailMessage();
        supportMessage.setFrom("ttgzee123@gmail.com");
        supportMessage.setTo("ttgzee123@gmail.com"); // Support email
        supportMessage.setSubject("New Contact Form Submission - " + contactForm.getEnquiryType());

        String supportEmailBody = String.format("""
        New Contact Form Submission
        
        Company: %s
        Name: %s
        Email: %s
        Phone: %s
        Order Reference: %s
        Enquiry Type: %s
        
        Message:
        %s
        """,
                contactForm.getCompanyName(),
                contactForm.getName(),
                contactForm.getEmail(),
                contactForm.getPhone(),
                contactForm.getOrderReference(),
                contactForm.getEnquiryType(),
                contactForm.getMessage()
        );

        supportMessage.setText(supportEmailBody);

        // Send acknowledgment to user
        SimpleMailMessage userMessage = new SimpleMailMessage();
        userMessage.setFrom("ttgzee123@gmail.com");
        userMessage.setTo(contactForm.getEmail());
        userMessage.setSubject("Thank you for contacting BT Router Services");

        String userEmailBody = String.format("""
        Dear %s,

        Thank you for contacting BT Router Services. We have received your enquiry and will respond to you within 24 hours during business days.

        For your reference, here are the details of your enquiry:
        - Company: %s
        - Enquiry Type: %s
        - Order Reference: %s

        If you need immediate assistance, please don't hesitate to contact our support team at:
        Email: admin@bt.com
        Phone: +44 2920 870000

        Best regards,
        BT Router Services Team
        """,
                contactForm.getName(),
                contactForm.getCompanyName(),
                contactForm.getEnquiryType(),
                contactForm.getOrderReference()
        );

        userMessage.setText(userEmailBody);

        try {
            // Sends both emails
            mailSender.send(supportMessage);
            mailSender.send(userMessage);
            logger.info("Contact form emails sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send contact form emails", e);
            throw e;
        }
    }
}