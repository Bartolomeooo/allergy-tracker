package org.example.allergytracker.exception.auth;

import org.example.allergytracker.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class UnauthenticatedException extends ApplicationException {

  public UnauthenticatedException(String message) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
