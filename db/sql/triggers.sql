-- Function deletes invalid shifts in Assigned_Shift upon update to Default_Time
-- Invalid shifts are shifts that begin before the start time or end after the close time of a date
CREATE OR REPLACE FUNCTION remove_shifts_upon_day_update()
  RETURNS TRIGGER AS $$
  BEGIN
    DELETE FROM Assigned_Shift
    WHERE NEW.date = date AND (start_time < NEW.start_time OR end_time > NEW.end_time);
    RETURN NEW;
  END;
  $$ LANGUAGE PLPGSQL;

-- Run remove_shifts_upon_day_update function upon update to Default_Time for each date affected
CREATE TRIGGER update_shifts_upon_day_update AFTER UPDATE OF start_time, end_time ON Default_Time FOR EACH ROW
EXECUTE PROCEDURE remove_shifts_upon_day_update();


-- Function ensures that an assigned shift is the minimum length of time before inserting to table.
-- Minimum length of time is 60 minutes.
CREATE OR REPLACE FUNCTION ensure_min_shift_length()
  RETURNS TRIGGER AS $$
  BEGIN
    -- EPOCH FROM ... gets seconds between the interval of end_time - start_time.
    -- Divide by 60 to get minutes from interval.
    IF EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60 >= 60 THEN
      RETURN NEW;
    ELSE
      RETURN NULL;
    END IF;
  END;
  $$ LANGUAGE PLPGSQL;

-- Ensures new assigned shifts are at least of minimum length.
CREATE TRIGGER validate_shift_length BEFORE INSERT ON Assigned_Shift FOR EACH ROW
  EXECUTE PROCEDURE ensure_min_shift_length();
-- Ensures new sub requests are at least of minimum length.
CREATE TRIGGER validate_sub_request_length BEFORE INSERT ON Trade_Request FOR EACH ROW
  EXECUTE PROCEDURE ensure_min_shift_length();


-- Function ensures that a shift operates within its day's open and close times.
CREATE OR REPLACE FUNCTION valid_shift_timeframe()
  RETURNS TRIGGER AS $$
  BEGIN
    IF
    (SELECT * FROM Default_Time AS D
      WHERE NEW.date = D.date AND (NEW.start_time < D.start_time OR NEW.end_time > D.end_time)
    ) IS NULL THEN
      RETURN NEW;
    ELSE
      RETURN NULL;
    END IF;
  END;
  $$ LANGUAGE PLPGSQL;

-- Ensures assigned shifts are only created within valid times in their corresponding Default_Time.
CREATE TRIGGER valid_shift_times BEFORE INSERT ON Assigned_Shift FOR EACH ROW
  EXECUTE PROCEDURE valid_shift_timeframe();