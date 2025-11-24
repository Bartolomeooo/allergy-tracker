package org.example.allergytracker.domain.entry.model;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import java.util.Optional;

@Embeddable
@Accessors(fluent = true)
@NoArgsConstructor
@AllArgsConstructor
public class Note {

    @Nullable
    private String value;

    public Optional<String> value() {
        return Optional.ofNullable(value);
    }

}
