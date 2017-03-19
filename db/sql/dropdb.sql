-- foreign keys
-- Assigned_Shift
ALTER TABLE IF EXISTS Assigned_Shift DROP CONSTRAINT IF EXISTS assigned_shift_fk_default_time;
ALTER TABLE IF EXISTS Assigned_Shift DROP CONSTRAINT IF EXISTS assigned_shift_fk_event;
ALTER TABLE IF EXISTS Assigned_Shift DROP CONSTRAINT IF EXISTS Assigned_Shift_fk_owner;
ALTER TABLE IF EXISTS Assigned_Shift DROP CONSTRAINT IF EXISTS Assigned_Shift_fk_covered_from;
-- Default_Time
ALTER TABLE IF EXISTS default_time DROP CONSTRAINT IF EXISTS default_time_fk_event;
-- Trade_Request
ALTER TABLE IF EXISTS Trade_Request DROP CONSTRAINT IF EXISTS Trade_Request_fk_Assigned_Shift;
ALTER TABLE IF EXISTS trade_request DROP CONSTRAINT IF EXISTS trade_request_fk_Event;


-- triggers
DROP TRIGGER IF EXISTS update_shifts_upon_day_update ON Default_Time;
DROP TRIGGER IF EXISTS validate_shift_length ON Assigned_Shift;
DROP TRIGGER IF EXISTS valid_shift_times ON Assigned_Shift;


-- functions
DROP FUNCTION IF EXISTS remove_shifts_upon_day_update();
DROP FUNCTION IF EXISTS ensure_min_shift_length();
DROP FUNCTION IF EXISTS valid_shift_time_frame();


-- tables
DROP TABLE IF EXISTS Assigned_Shift;
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Default_Time;
DROP TABLE IF EXISTS Trade_Request;
DROP TABLE IF EXISTS Event;