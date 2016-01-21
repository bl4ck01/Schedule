-- Employee table contains employee information.
CREATE TABLE Employee (
  uid varchar(20) NOT NULL,
  name varchar(100) NOT NULL,
  phone_num char(10) NOT NULL,
  role int NOT NULL
);

-- Constraints on Employee table.
ALTER TABLE Employee
  -- primary key
  ADD CONSTRAINT Employee_pk PRIMARY KEY (uid),
  -- foreign keys
  -- other constraints
    -- full name of employee is unique.
  ADD CONSTRAINT name_key UNIQUE(name) NOT DEFERRABLE INITIALLY IMMEDIATE,
    -- phone number must be a valid U.S. (10-digit) number. Any dashes, etc. should be stripped from number before sending to database.
  ADD CONSTRAINT valid_phone_num CHECK(CHAR_LENGTH(phone_num) = 10) NOT DEFERRABLE INITIALLY IMMEDIATE;