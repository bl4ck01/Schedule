#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo "Home directory not found. ex: bash calendar-setup ~/project_home_directory/"
    exit 1
fi

DIR=$1

echo "Project home directory: ${DIR}."
echo "If this is not correct, cancel script with CTRL-C"
sleep 2

echo "Adding required calendar files to project..."
echo ""
# move to project home directory
cd ${DIR}
bower install bootstrap-calendar
cd bower_components/
cp underscore/underscore-mins.js ../public/javascripts/underscore-mins.js
cd bootstrap-calendar
cp css/calendar.css ../../public/stylesheets/calendar.css
cp img/* ../../images/
cp tmpls/* ../../views/tmpls/
cp js/calendar.js ../../public/javascripts/calendar.js

echo ""
echo "Finished copying required calendar files"
echo ""