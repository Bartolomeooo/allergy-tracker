package org.example.allergytracker.domain.entry.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.UUID;

@Entity
@Table(
        name = ExposureType.TABLE_NAME,
        uniqueConstraints = @UniqueConstraint(columnNames = ExposureType.VALUE_COLUMN_NAME)
)
@Getter
@Accessors(fluent = true)
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor
public class ExposureType {

  static final String TABLE_NAME = "exposure_types";
  static final String VALUE_COLUMN_NAME = "value";
  private static final String DESCRIPTION_COLUMN_NAME = "description";
  private static final String ID_COLUMN_NAME = "id";

  @Id
  @Column(name = ID_COLUMN_NAME, nullable = false, updatable = false)
  private UUID id;

  @Column(name = VALUE_COLUMN_NAME, nullable = false)
  private String value;

  @Column(name = DESCRIPTION_COLUMN_NAME)
  private String description;
}
