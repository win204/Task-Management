package com.phong.taskmanagement.aspect;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;
import java.util.List;

@Aspect
@Component
public class LoggingAspect {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    // Do NOT log passwords, JWT secrets, access tokens, refresh tokens
    private final List<String> SENSITIVE_FIELDS = Arrays.asList("password", "secret", "token", "refreshToken", "accessToken");

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerPointcut() {}

    @Pointcut("within(@org.springframework.stereotype.Service *)")
    public void servicePointcut() {}

    @Before("controllerPointcut()")
    public void logBeforeController(JoinPoint joinPoint) {
        if (log.isDebugEnabled()) {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                log.debug("REST Request: {} {}", request.getMethod(), request.getRequestURI());
                
                Object[] args = joinPoint.getArgs();
                if (args != null && args.length > 0) {
                    log.debug("Arguments: {}", sanitizeArgs(args));
                }
            }
        }
    }

    @AfterReturning(pointcut = "controllerPointcut()", returning = "result")
    public void logAfterController(JoinPoint joinPoint, Object result) {
        if (log.isDebugEnabled()) {
            log.debug("REST Response from {}.{}: {}", 
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    sanitizeResult(result));
        }
    }

    @AfterThrowing(pointcut = "controllerPointcut() || servicePointcut()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        log.error("Exception in {}.{}() with cause = \'{}\' and exception = \'{}\'",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                e.getCause() != null ? e.getCause() : "NULL",
                e.getMessage(), e);
    }

    @Around("servicePointcut()")
    public Object logServiceExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long elapsedTime = System.currentTimeMillis() - start;
            if (log.isDebugEnabled()) {
                log.debug("Service method {}.{}() executed in {} ms",
                        joinPoint.getSignature().getDeclaringTypeName(),
                        joinPoint.getSignature().getName(),
                        elapsedTime);
            }
            return result;
        } catch (IllegalArgumentException e) {
            log.error("Illegal argument: {} in {}.{}()",
                    Arrays.toString(joinPoint.getArgs()),
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName());
            throw e;
        }
    }

    private String sanitizeArgs(Object[] args) {
        if (args == null) return "null";
        List<Object> loggableArgs = Arrays.stream(args)
                .filter(arg -> !(arg instanceof jakarta.servlet.http.HttpServletRequest)
                            && !(arg instanceof jakarta.servlet.http.HttpServletResponse)
                            && !(arg instanceof org.springframework.web.multipart.MultipartFile))
                .toList();
        String str = loggableArgs.toString();
        return maskSensitiveData(str);
    }
    
    private String sanitizeResult(Object result) {
        if (result == null) return "null";
        String str = result.toString();
        return maskSensitiveData(str);
    }

    private String maskSensitiveData(String str) {
        if (str == null) return null;
        String maskedStr = str;
        for (String field : SENSITIVE_FIELDS) {
            maskedStr = maskedStr.replaceAll("(?i)(" + field + ")\\s*[=:]\\s*['\"]?[^,\\}'\"\\]]+['\"]?", "$1=***");
        }
        return maskedStr;
    }
}
