package org.example.allergytracker.exception.entry;

import org.example.allergytracker.exception.ApplicationException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class EntryNotFoundException extends ApplicationException {

  public EntryNotFoundException(UUID entryId) {
    super("Entry not found: " + entryId, HttpStatus.NOT_FOUND);
  }
}
