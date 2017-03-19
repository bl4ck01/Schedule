#!/bin/bash
# Writing each line individually instead of using a loop to ensure proper database setup.
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/event-ddl.sql';
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/employee-ddl.sql';
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/default-time-ddl.sql';
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/assigned-shift-ddl.sql';
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/trade-request-ddl.sql';
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/indexes.sql';
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/triggers.sql';