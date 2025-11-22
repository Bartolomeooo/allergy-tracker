package org.example.allergytracker.exception.auth;

import org.example.allergytracker.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class EmailAlreadyInUseException extends ApplicationException {

  public EmailAlreadyInUseException(String email) {
    super("Email already in use: " + email, HttpStatus.CONFLICT);
  }
}
