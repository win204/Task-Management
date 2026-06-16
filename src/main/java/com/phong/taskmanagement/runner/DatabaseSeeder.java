package com.phong.taskmanagement.runner;

import com.phong.taskmanagement.entity.Role;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.repository.RoleRepository;
import com.phong.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {

        if (userRepository.existsByEmail(
                "admin@gmail.com")) {
            return;
        }

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException(
                        "ADMIN role not found"));

        User admin = User.builder()
                .email("admin@gmail.com")
                .username("admin")
                .fullName("Administrator")
                .password(
                        passwordEncoder.encode(
                                "123123"))
                .active(true)
                .roles(Set.of(adminRole))
                .build();

        userRepository.save(admin);

        log.info(
                "Default admin created: admin / 123123");
    }
}
