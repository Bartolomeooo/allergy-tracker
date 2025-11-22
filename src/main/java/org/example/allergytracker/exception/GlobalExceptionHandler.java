package org.example.allergytracker.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import static org.slf4j.LoggerFactory.getLogger;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final org.slf4j.Logger LOGGER = getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(ApplicationException.class)
  public ResponseEntity<Map<String, Object>> handleException(ApplicationException e) {
    LOGGER.warn("Application exception occurred: {} - {}", e.getClass().getSimpleName(), e.getMessage());

    var body = new HashMap<String, Object>();
    body.put("timestamp", Instant.now().toString());
    body.put("status", e.getStatus().value());
    body.put("error", e.getStatus().getReasonPhrase());
    body.put("message", e.getMessage());

    return ResponseEntity.status(e.getStatus()).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleException(Exception e) {
    LOGGER.error("Unexpected exception occurred", e);

    var body = new HashMap<String, Object>();
    body.put("timestamp", Instant.now().toString());
    body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
    body.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
    body.put("message", "An unexpected error occurred");

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
