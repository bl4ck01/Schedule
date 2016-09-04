-- Variable-length employee shifts.
CREATE TABLE Assigned_Shift (
  sid serial NOT NULL,
  date date NOT NULL,
  -- when shift begins
  start_time time NOT NULL,
  -- when shift ends
  end_time time NOT NULL,
  -- uid of current Employee responsible for covering this shift
  owner varchar(20) NOT NULL,
  -- If shift was picked up, uid of the original owner of the shift
  covered_from varchar(20)
);

-- Constraints on Assigned_Shift table.
ALTER TABLE Assigned_Shift
  -- primary key
  ADD CONSTRAINT Assigned_Shift_pk PRIMARY KEY (sid),
  -- foreign keys
  ADD CONSTRAINT Assigned_Shift_fk_Default_Time FOREIGN KEY (date)
    REFERENCES Default_Time (date)
    ON DELETE CASCADE
    -- on update trigger update_shifts_upon_day_update will fire.
    NOT DEFERRABLE INITIALLY IMMEDIATE,
  ADD CONSTRAINT Assigned_Shift_fk_owner FOREIGN KEY (owner)
    REFERENCES Employee (uid)
    ON DELETE CASCADE
    NOT DEFERRABLE INITIALLY IMMEDIATE,
  ADD CONSTRAINT Assigned_Shift_fk_covered_from FOREIGN KEY (covered_from)
    REFERENCES Employee (uid)
    ON DELETE CASCADE
    NOT DEFERRABLE INITIALLY IMMEDIATE;
  -- other constraints
