package org.example.allergytracker.domain.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.example.allergytracker.domain.entry.model.Entry;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = User.TABLE_NAME)
@Getter
@Setter
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
public class User {

  static final String TABLE_NAME = "users";

  @Id
  private UUID id;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Entry> entries = new ArrayList<>();
}
