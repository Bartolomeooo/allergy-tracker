package org.example.allergytracker.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PepperedPasswordEncoder implements PasswordEncoder {

  private final BCryptPasswordEncoder bcryptEncoder;
  private final String pepper;

  public PepperedPasswordEncoder(String pepper) {
    this.pepper = pepper;
    this.bcryptEncoder = new BCryptPasswordEncoder();
  }

  @Override
  public String encode(CharSequence rawPassword) {
    return bcryptEncoder.encode(rawPassword + pepper);
  }

  @Override
  public boolean matches(CharSequence rawPassword, String encodedPassword) {
    return bcryptEncoder.matches(rawPassword + pepper, encodedPassword);
  }

  @Override
  public boolean upgradeEncoding(String encodedPassword) {
    return bcryptEncoder.upgradeEncoding(encodedPassword);
  }
}
