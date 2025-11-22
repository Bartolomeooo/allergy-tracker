package org.example.allergytracker.domain.auth.validator;

import org.springframework.stereotype.Component;

@Component
public class DefaultEmailValidator implements EmailValidator {

  @Override
  public String normalize(String email) {
    return email.trim().toLowerCase();
  }
}
