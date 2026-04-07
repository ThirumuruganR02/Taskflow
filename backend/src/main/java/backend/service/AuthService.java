package backend.service;

import backend.dto.request.LoginRequest;
import backend.dto.request.SignupRequest;
import backend.dto.response.AuthResponse;
import backend.entity.User;
import backend.enums.Role;
import backend.repository.UserRepository;
import backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse signup(SignupRequest request) {
        validateSignupRequest(request);

        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .message("User registered successfully!")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Login successful!")
                .build();
    }

    private void validateSignupRequest(SignupRequest request) {
        String username = request.getUsername() == null ? "" : request.getUsername().trim();
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (username.isBlank()) {
            throw new RuntimeException("Username is required!");
        }

        if (email.isBlank()) {
            throw new RuntimeException("Email is required!");
        }

        if (password.isBlank()) {
            throw new RuntimeException("Password is required!");
        }

        if (password.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long!");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists!");
        }

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists!");
        }
    }
}
