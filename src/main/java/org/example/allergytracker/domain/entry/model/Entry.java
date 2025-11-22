package org.example.allergytracker.domain.entry.model;

import lombok.*;
import lombok.experimental.Accessors;
import jakarta.persistence.*;
import org.example.allergytracker.domain.user.model.User;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = Entry.TABLE_NAME)
@Getter
@Setter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
public class Entry {

  static final String TABLE_NAME = "entries";

  private static final String ENTRY_EXPOSURE_TYPES_TABLE_NAME = "entry_exposure_types";
  private static final String ENTRY_EXPOSURE_TYPES_ENTRY_ID = "entry_id";
  private static final String ENTRY_EXPOSURE_TYPES_EXPOSURE_TYPE_ID = "exposure_type_id";
  private static final String UPPER_RESPIRATORY_COL = "upper_respiratory_value";
  private static final String LOWER_RESPIRATORY_COL = "lower_respiratory_value";
  private static final String SKIN_COL = "skin_value";
  private static final String EYES_COL = "eyes_value";
  private static final String NOTE_COL = "note_value";

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  LocalDate occurredOn;

  @Embedded
  @AttributeOverride(name = "value", column = @Column(name = UPPER_RESPIRATORY_COL))
  Symptoms upperRespiratory;
  @Embedded
  @AttributeOverride(name = "value", column = @Column(name = LOWER_RESPIRATORY_COL))
  Symptoms lowerRespiratory;
  @Embedded
  @AttributeOverride(name = "value", column = @Column(name = SKIN_COL))
  Symptoms skin;
  @Embedded
  @AttributeOverride(name = "value", column = @Column(name = EYES_COL))
  Symptoms eyes;

  @Embedded
  @AttributeOverride(name = "value", column = @Column(name = NOTE_COL))
  Note note;

  Instant createdAt;
  Instant updatedAt;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
          name = ENTRY_EXPOSURE_TYPES_TABLE_NAME,
          joinColumns = @JoinColumn(name = ENTRY_EXPOSURE_TYPES_ENTRY_ID),
          inverseJoinColumns = @JoinColumn(name = ENTRY_EXPOSURE_TYPES_EXPOSURE_TYPE_ID)
  )
  private List<ExposureType> exposureTypes;
}
