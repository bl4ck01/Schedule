-- Daily times the Help Desk is open.
CREATE TABLE Default_Time (
  date date NOT NULL,
  -- 0-based integer of week day, Mon=0, Sun=6
  day_of_week int NOT NULL,
  -- time Help Desk opens that day
  start_time time NOT NULL,
  -- time Help Desk closes that day
  end_time time NOT NULL
);

-- Constraints on Default_Time table.
ALTER TABLE Default_Time
  -- primary key
  ADD CONSTRAINT Default_Time_pk PRIMARY KEY (date),
  -- foreign keys
  -- other constraints
  -- day_of_week is 0-indexed and must be a valid number between 0 and 6 (0 = Monday, 1 = Tuesday, etc.).
  ADD CONSTRAINT valid_day CHECK(day_of_week >= 0 AND day_of_week < 7) NOT DEFERRABLE INITIALLY IMMEDIATE;