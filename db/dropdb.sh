#!/bin/bash
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/dropdb.sql';