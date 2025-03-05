package cf.ac.uk.btrouter.config;

import cf.ac.uk.btrouter.service.CustomUserDetailsService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.CorsConfigurationSource;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    // JWT configuration values from application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    // Create and configure JWT authentication filter
    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(customUserDetailsService, jwtSecret);
    }

    // Configure the authentication provider with custom user details service
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Create authentication manager bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Configure password encoder for secure password storage
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configure security filter chain with JWT and role-based authentication
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/support/**").hasAnyRole("ADMIN", "SUPPORT_AGENT")
                        .requestMatchers("/api/user/**").hasAnyRole("ADMIN", "SUPPORT_AGENT", "USER")
                        .requestMatchers("/api/orders/**").hasAnyRole("ADMIN", "SUPPORT_AGENT", "USER") //all roles allowed
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Frontend URL
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // JWT authentication filter implementation
    public class JwtAuthFilter extends OncePerRequestFilter {
        private final UserDetailsService userDetailsService;
        private final String jwtSecret;

        // Constructor for JWT filter
        public JwtAuthFilter(UserDetailsService userDetailsService, String jwtSecret) {
            this.userDetailsService = userDetailsService;
            this.jwtSecret = jwtSecret;
        }
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                throws ServletException, IOException {
            final String authHeader = request.getHeader("Authorization");

            System.out.println("Incoming request: " + request.getRequestURI());
            System.out.println("JWT Secret being used: " + jwtSecret);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("No valid Authorization header found.");
                chain.doFilter(request, response);
                return;
            }

            String jwt = authHeader.substring(7);
            String username = extractUsername(jwt);
            String role = extractRole(jwt);

            System.out.println("Extracted Username: " + username);
            System.out.println("Extracted Role: " + role);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (validateToken(jwt)) {
                    System.out.println("JWT is valid. Authenticating user...");

                    List<SimpleGrantedAuthority> authorities =
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.out.println("Invalid JWT token.");
                    System.out.println("✅ Authentication set: " + SecurityContextHolder.getContext().getAuthentication()); //debugging
                }
            }
            chain.doFilter(request, response);
        }

        // Extract username from JWT token
        private String extractUsername(String token) {
            try {
                return Jwts.parser()
                        .setSigningKey(jwtSecret)
                        .parseClaimsJws(token)
                        .getBody()
                        .getSubject();
            } catch (Exception e) {
                System.out.println("Error extracting username: " + e.getMessage());
                return null;
            }
        }

        // Extract role from JWT token
        private String extractRole(String token) {
            try {
                return Jwts.parser()
                        .setSigningKey(jwtSecret)
                        .parseClaimsJws(token)
                        .getBody()
                        .get("role", String.class);
            } catch (Exception e) {
                System.out.println("Error extracting role: " + e.getMessage());
                return null;
            }
        }

        // Validate JWT token
        private boolean validateToken(String token) {
            try {
                Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
    }

    // Generate new JWT token with username and role
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    // Extract username from JWT token
    public String extractUsername(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Extract role from JWT token
    public String extractRole(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("role", String.class);
    }
}

//
//// ============================================================
//// testing
//package cf.ac.uk.btrouter.config;
//
//import cf.ac.uk.btrouter.security.JwtAuthFilter;
//import cf.ac.uk.btrouter.security.JwtAuthenticationProvider;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.annotation.Order;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.web.context.SecurityContextPersistenceFilter;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    private final JwtAuthFilter jwtAuthFilter;
//    private final JwtAuthenticationProvider jwtAuthenticationProvider;
//
//    public SecurityConfig(JwtAuthFilter jwtAuthFilter, JwtAuthenticationProvider jwtAuthenticationProvider) {
//        this.jwtAuthFilter = jwtAuthFilter;
//        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
//    }
//
//    // Define password encoder
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    // Configure the AuthenticationManager
//    @Bean
//    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
//        return http.getSharedObject(AuthenticationManagerBuilder.class)
//                .userDetailsService(userDetailsService())
//                .passwordEncoder(passwordEncoder())
//                .and()
//                .build();
//    }
//
//    // CORS Configuration
//    private org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
//        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
//        configuration.setAllowedOrigins(java.util.Collections.singletonList("http://localhost:3000"));
//        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(java.util.Arrays.asList("Authorization", "Content-Type"));
//        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//
//    // Security Filter Chain setup
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        return http
//                .csrf(csrf -> csrf.disable())
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .authorizeRequests(auth -> auth
//                        .antMatchers("/api/auth/**").permitAll()
//                        .antMatchers("/api/orders/**").hasAnyRole("USER", "ADMIN", "SUPPORT_AGENT")
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)  // Add the JWT filter before username password filter
//                .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))  // Stateless sessions
//                .authenticationProvider(jwtAuthenticationProvider)  // Use custom JWT authentication provider
//                .build();
//    }
//
//    // Register the UserDetailsService for JWT authentication provider
//    @Bean
//    public UserDetailsService userDetailsService() {
//        return new CustomUserDetailsService();  // Your custom implementation of UserDetailsService
//    }
//
//    // If using in-memory or database authentication (e.g., UserDetailsService)
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//        auth.authenticationProvider(jwtAuthenticationProvider);
//    }
//
//}
