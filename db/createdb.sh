#!/usr/bin/env bash
# Writing each line individually instead of using a loop to ensure proper database setup.
psql schedule-dev akalfus -f 'sql/employee-ddl.sql';
psql schedule-dev akalfus -f 'sql/shift-time-ddl.sql';
psql schedule-dev akalfus -f 'sql/assigned-shift-ddl.sql';
psql schedule-dev akalfus -f 'sql/trade-request-ddl.sql';
psql schedule-dev akalfus -f 'sql/indexes.sql';
psql schedule-dev akalfus -f 'sql/triggers.sql';