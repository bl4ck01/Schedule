#!/usr/bin/env bash
# Writing each line individually instead of using a loop to ensure proper database setup.
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/employee-ddl.sql' -w;
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/default-time-ddl.sql' -w;
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/assigned-shift-ddl.sql' -w;
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/trade-request-ddl.sql' -w;
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/ddls/event-ddl.sql' -w;
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/indexes.sql' -w;
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/triggers.sql' -w;