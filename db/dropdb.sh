#!/usr/bin/env bash
psql schedule-dev -U ltshelpdesk -h localhost -f 'sql/dropdb.sql' -w;