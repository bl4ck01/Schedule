$(document).ready(() => {
  const cal = $('#calendar');
  // initialize calendar
  cal.fullCalendar({
    // automatically resize calendar when browser window resizes
    handleWindowResize: true,
    // emphasizes time slots on agenda view if configured for objects
    // see http://fullcalendar.io/docs/display/businessHours/
    businessHours: true,
    // limits the number of events displayed on a day.
    // A value of true will limit the number of events to the height of the day cell.
    // An integer value will limit the events to a specific number of rows.
    eventLimit: true,


    // construct custom buttons that can be used in the calendar header
    customButtons: {
      clockIn: {
        text: 'Clock in',
        click: () => {
          location.assign('/clock/in');
        }
      }
    },

    header: {
      left: 'month,agendaWeek,agendaDay',
      center: 'title',
      right: 'clockIn today prev,next'
    },

    // specify options applicable to only certain views
    // define custom views
    views: {

    },
    defaultView: 'agendaWeek',
    // put options and callbacks here
    dayClick: (date, jsEvent, view) => {
      if (view.name === 'month' || view.name === 'agendaWeek') {
        cal.fullCalendar('gotoDate', date);
        cal.fullCalendar('changeView', 'agendaDay');
      }
    },

    eventClick: (event, jsEvent, view) => {

    }
  })
});