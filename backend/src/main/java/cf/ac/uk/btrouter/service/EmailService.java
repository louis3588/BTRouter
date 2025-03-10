package cf.ac.uk.btrouter.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

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
                "This link will expire in 24 hours.\n\n" +
                "If you did not request a password reset, please ignore this email.");

        // Send the email
        mailSender.send(message);
    }
}