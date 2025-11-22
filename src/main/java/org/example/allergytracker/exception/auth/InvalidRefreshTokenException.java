package org.example.allergytracker.exception.auth;

import org.example.allergytracker.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class InvalidRefreshTokenException extends ApplicationException {

  public InvalidRefreshTokenException() {
    super("Invalid refresh token", HttpStatus.UNAUTHORIZED);
  }
}
