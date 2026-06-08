package com.phong.taskmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.phong.taskmanagement.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(ex -> ex

                        .authenticationEntryPoint(
                                (request, response, authException) -> {

                                    System.out.println(
                                            ">>> 401 AuthenticationEntryPoint"
                                    );

                                    response.setStatus(401);
                                    response.setContentType(
                                            MediaType.APPLICATION_JSON_VALUE
                                    );

                                    response.getWriter().write("""
                                            {
                                              "status":401,
                                              "message":"Unauthenticated"
                                            }
                                            """);
                                })

                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {

                                    System.out.println(
                                            ">>> 403 AccessDeniedHandler"
                                    );

                                    response.setStatus(403);
                                    response.setContentType(
                                            MediaType.APPLICATION_JSON_VALUE
                                    );

                                    response.getWriter().write("""
                                            {
                                              "status":403,
                                              "message":"Access Denied"
                                            }
                                            """);
                                })
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        )
                        .permitAll()

                        .requestMatchers("/api/users/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/projects/**")
                        .hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        .requestMatchers("/api/tasks/**")
                        .hasAnyRole(
                                "ADMIN",
                                "MANAGER",
                                "EMPLOYEE"
                        )

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}