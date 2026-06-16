package com.phong.taskmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptTest {
    @Test
    public void testBcrypt() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("TEST_MATCHES=" + encoder.matches("123123", "$2a$10$02bc5xeMbPvD/7EXutfIBepkcNgARt1YI7gnC6QmpAM5i3QO/mSlC"));
        System.out.println("TEST_HASH=" + encoder.encode("123123"));
    }
}
