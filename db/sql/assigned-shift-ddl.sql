-- Variable-length employee shifts.
CREATE TABLE Assigned_Shift (
  sid serial NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  owner varchar(20) NOT NULL,
  covered_from varchar(20) NULL
);

-- Constraints on Assigned_Shift table.
ALTER TABLE Assigned_Shift
  -- primary key
  ADD CONSTRAINT Assigned_Shift_pk PRIMARY KEY (sid),
  -- foreign keys
  ADD CONSTRAINT Assigned_Shift_fk_Shift_Time FOREIGN KEY (date)
    REFERENCES Shift_Time (date)
    ON DELETE CASCADE
    -- on update trigger update_shifts_upon_day_update will fire.
    NOT DEFERRABLE INITIALLY IMMEDIATE,
  ADD CONSTRAINT Assigned_Shift_fk_owner FOREIGN KEY (owner)
    REFERENCES Employee(uid)
    ON DELETE CASCADE
    NOT DEFERRABLE INITIALLY IMMEDIATE,
  ADD CONSTRAINT Assigned_Shift_fk_covered_from FOREIGN KEY (covered_from)
    REFERENCES Employee(uid)
    ON DELETE CASCADE
    NOT DEFERRABLE INITIALLY IMMEDIATE;
  -- other constraints