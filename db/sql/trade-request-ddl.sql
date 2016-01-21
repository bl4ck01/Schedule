-- Request to drop a shift
CREATE TABLE Trade_Request (
  tid serial NOT NULL,
  sid serial NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL
);

-- Constraints on Trade_Request table.
ALTER TABLE Trade_Request
  -- primary key
  ADD CONSTRAINT Trade_Request_pk PRIMARY KEY (tid),
  -- foreign keys
  ADD CONSTRAINT Trade_Request_fk_Assigned_Shift FOREIGN KEY (sid)
    REFERENCES Assigned_Shift (sid)
    ON DELETE CASCADE
    NOT DEFERRABLE INITIALLY IMMEDIATE
  -- other constraints