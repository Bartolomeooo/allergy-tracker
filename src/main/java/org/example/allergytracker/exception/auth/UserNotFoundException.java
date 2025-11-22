package org.example.allergytracker.exception.auth;

import org.example.allergytracker.exception.ApplicationException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class UserNotFoundException extends ApplicationException {

  public UserNotFoundException(UUID userId) {
    super("User not found: " + userId, HttpStatus.NOT_FOUND);
  }
}
