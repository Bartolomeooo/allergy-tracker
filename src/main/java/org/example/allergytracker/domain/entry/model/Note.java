package org.example.allergytracker.domain.entry.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Embeddable
@Getter
@Accessors(fluent = true)
@NoArgsConstructor
@AllArgsConstructor
public class Note {

    private String value;
}
