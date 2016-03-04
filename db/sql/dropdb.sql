-- foreign keys
ALTER TABLE IF EXISTS Assigned_Shift DROP CONSTRAINT IF EXISTS Assigned_Shift_fk_Default_Time;
ALTER TABLE IF EXISTS Assigned_Shift DROP CONSTRAINT IF EXISTS Assigned_Shift_fk_owner;
ALTER TABLE IF EXISTS Assigned_Shift DROP CONSTRAINT IF EXISTS Assigned_Shift_fk_covered_from;
ALTER TABLE IF EXISTS Trade_Request DROP CONSTRAINT IF EXISTS Trade_Request_fk_Assigned_Shift;




-- triggers
DROP TRIGGER IF EXISTS update_shifts_upon_day_update ON Default_Time;
DROP TRIGGER IF EXISTS validate_shift_length ON Assigned_Shift;
DROP TRIGGER IF EXISTS validate_sub_request_length ON Trade_Request;
DROP TRIGGER IF EXISTS valid_shift_times ON Assigned_Shift;




-- functions
DROP FUNCTION IF EXISTS remove_shifts_upon_day_update();
DROP FUNCTION IF EXISTS ensure_min_shift_length();
DROP FUNCTION IF EXISTS valid_shift_timeframe();




-- tables
DROP TABLE IF EXISTS Assigned_Shift;
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Default_Time;
DROP TABLE IF EXISTS Trade_Request;
DROP TABLE IF EXISTS Event;