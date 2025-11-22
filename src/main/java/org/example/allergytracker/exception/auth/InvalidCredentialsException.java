package org.example.allergytracker.exception.auth;

import org.example.allergytracker.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends ApplicationException {

  public InvalidCredentialsException() {
    super("Invalid credentials", HttpStatus.UNAUTHORIZED);
  }
}
