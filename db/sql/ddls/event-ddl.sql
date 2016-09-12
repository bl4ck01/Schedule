-- Event table holds fullcalendar.io Event information to construct shifts
CREATE TABLE Event (
  -- sid of an Assigned-Shift
  sid serial NOT NULL,
  -- The text on an event's element
  title varchar(100) NOT NULL,
  -- Whether an event occurs at a specific time-of-day. Affects whether an event's time is shown.
  -- Also, in the agenda views, determines if it is displayed in the "all-day" section.
  allDay boolean,
  -- Allows alternate rendering of the event, like background events.
  -- Can be empty, "background", or "inverse-background"
  rendering varchar(18),
  -- Restricts the business hours of this event. Object may contain the following properties:
  -- {
  --   start: '10:00', // a start time (10am in this example)
  --   end: '18:00', // an end time (6pm in this example)
  --
  --   dow: [ 1, 2, 3, 4 ]
  --   // days of week. an array of zero-based day of week integers (0=Sunday)
  --   // (Monday-Thursday in this example)
  -- }
  eventConstraint jsonb,
  eventSource jsonb
);

-- Constraints on Event table.
ALTER TABLE Event
  -- primary key
  ADD CONSTRAINT Event_pk PRIMARY KEY (sid),
  -- foreign keys
  ADD CONSTRAINT Event_fk_id FOREIGN KEY (sid)
    REFERENCES Assigned_Shift (sid)
    ON DELETE CASCADE
    NOT DEFERRABLE INITIALLY IMMEDIATE
  -- other constraints
  ;