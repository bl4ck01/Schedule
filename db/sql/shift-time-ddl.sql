-- Daily times the Help Desk is open.
CREATE TABLE Shift_Time (
  date date NOT NULL,
  day_of_week int NOT NULL,
  start_time int NOT NULL,
  end_time int NOT NULL
);

-- Constraints on Shift_Time table.
ALTER TABLE Shift_Time
  -- primary key
  ADD CONSTRAINT Shift_Time_pk PRIMARY KEY (date),
  -- foreign keys
  -- other constraints
    -- day_of_week is 0-indexed and must be a valid number between 0 and 6 (0 = Monday, 1 = Tuesday, etc.).
  ADD CONSTRAINT valid_day CHECK(day_of_week >= 0 AND day_of_week < 7) NOT DEFERRABLE INITIALLY IMMEDIATE;