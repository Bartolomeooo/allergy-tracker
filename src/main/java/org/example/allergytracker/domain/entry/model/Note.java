package org.example.allergytracker.domain.entry.model;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import java.util.Optional;

@Embeddable
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
public class Note {

    @Nullable
    private String value;

    public Optional<String> value() {
        return Optional.ofNullable(value);
    }
}
