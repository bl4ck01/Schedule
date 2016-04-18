$(document).ready(() => {
  const cal = $('#calendar');
  const template = $('#temp-cal');
  // initialize calendar
  cal.fullCalendar({
    // automatically resize calendar when browser window resizes
    handleWindowResize: true,
    timeFormat: 'h(:mm)t',
    // emphasizes time slots on agenda view if configured for objects
    // see http://fullcalendar.io/docs/display/businessHours/
    businessHours: {
      start: '09:00:00',
      end: '22:00:00',
      dow: [1,2,3,4]
    },
    // limits the number of events displayed on a day.
    // A value of true will limit the number of events to the height of the day cell.
    // An integer value will limit the events to a specific number of rows.
    eventLimit: true,
    selectable: false,
    selectHelper: true,
    unselectAuto: true, //TODO: see unselectCancel options: http://fullcalendar.io/docs/selection/unselectCancel/,
    nowIndicator: true,

    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day'
    },
    events: [
      {
        title: 'Yoseph',
        start: '2016-04-19T12:30:00',
        end: '2016-04-19T14:00:00'
      },
      {
        title: 'Jonathan',
        start: '2016-04-19T12:30:00',
        end: '2016-04-19T14:30:00'
      },
      {
        title: 'Ari',
        start: '2016-04-19T12:30:00',
        end: '2016-04-19T14:00:00'
      },
      {
        title: 'Blake Myers',
        start: '2016-04-19T12:30:00',
        end: '2016-04-19T15:45:00'
      },
      {
        title: 'kotechar',
        start: '2016-04-19T11:15:00',
        end: '2016-04-19T13:15:00'
      }
    ],

    // construct custom buttons that can be used in the calendar header
    customButtons: {
      clockIn: {
        text: 'Clock in',
        click: () => {
          location.assign('/clock/in');
        }
      },
      manage: {
        text: 'Manage',
        click: () => {
          location.assign('/admin');
        }
      }
    },

    header: {
      left: 'month,agendaWeek,agendaDay',
      center: 'title',
      right: 'manage clockIn today prev,next'
    },

    // specify options applicable to only certain views
    // define custom views
    views: {
      agendaWeek: {
        minTime: '08:00:00',
        maxTime: '22:00:00',
        slotEventOverlap: false
      },
      agendaDay: {
        minTime: '08:00:00',
        maxTime: '22:00:00',
        slotEventOverlap: false
      },
      month: {
        slotEventOverlap: false
      }
    },
    defaultView: 'agendaWeek',

    // functions applicable to the calendar
    dayClick: (date, jsEvent, view) => {
      if (view.name === 'month' || view.name === 'week') {
        cal.fullCalendar('gotoDate', date);
        cal.fullCalendar('changeView', 'agendaDay');
      }
    },

    eventClick: (event, jsEvent, view) => {
      showSubRequestForm(event);
    }
  });

  // initialize weekly template calendar
  template.fullCalendar({
    // automatically resize calendar when browser window resizes
    handleWindowResize: true,
    timeFormat: 'h(:mm)t',
    // emphasizes time slots on agenda view if configured for objects
    // see http://fullcalendar.io/docs/display/businessHours/
    businessHours: {
      start: '09:00:00',
      end: '22:00:00'
    },
    // limits the number of events displayed on a day.
    // A value of true will limit the number of events to the height of the day cell.
    // An integer value will limit the events to a specific number of rows.
    eventLimit: true,
    selectable: false,
    selectHelper: true,
    unselectAuto: true, //TODO: see unselectCancel options: http://fullcalendar.io/docs/selection/unselectCancel/,
    nowIndicator: true,

    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day'
    },
    events: [
      {
        title: 'Yoseph',
        start: '2016-04-19T12:30:00',
        end: '2016-04-19T14:00:00'
      },
      {
        title: 'Jonathan',
        start: '2016-04-19T12:30:00',
        end: '2016-04-19T14:30:00'
      },
      {
        title: 'Ari',
        start: '2016-04-19T12:30:00',
        end: '2016-04-19T14:00:00'
      },
      {
        title: 'Blake Myers',
        start: '2016-04-19T12:30:00',
        end: '2016-04-19T15:45:00'
      },
      {
        title: 'kotechar',
        start: '2016-04-19T11:15:00',
        end: '2016-04-19T13:15:00'
      }
    ],

    header: {
      left: 'month,agendaWeek,agendaDay',
      center: 'Weekly Shifts Template',
      right: 'today prev,next'
    },

    // specify options applicable to only certain views
    // define custom views
    views: {
      agendaWeek: {
        minTime: '08:00:00',
        maxTime: '22:00:00',
        slotEventOverlap: false
      },
      agendaDay: {
        minTime: '08:00:00',
        maxTime: '22:00:00',
        slotEventOverlap: false
      },
      month: {
        slotEventOverlap: false
      }
    },
    defaultView: 'agendaWeek',

    // functions applicable to the calendar
    dayClick: (date, jsEvent, view) => {
      //TODO: Replace logic with switch to day/week view from week/month views
      if (view.name === 'month' || view.name === 'week') {
        cal.fullCalendar('gotoDate', date);
        cal.fullCalendar('changeView', 'agendaDay');
      }
    },

    eventClick: (event, jsEvent, view) => {
      showSubRequestForm(event);
    }
  });

  /**
   * Bring up the sub request form
   */
  function showSubRequestForm(event) {
    $('#sub-request-shift').attr('value', event.start.format('MMMM Do, YYYY'));
    $('#sub-request-begin-time').timepicker('setTime', event.start.format("hh:mm a"));
    $('#sub-request-end-time').timepicker('setTime', event.end.format("hh:mm a"));
    $('#sub-request-div').show();
  }

  /**
   * Clear and close the sub request form
   */
  $('#close-sub-request').on('click', () => {
    $('#sub-request-div').hide(() => {
      $('#sub-request-shift').attr('value', '');
      $('#sub-request-begin-time').timepicker('setTime', '');
      $('#sub-request-end-time').timepicker('setTime', '');
    });
  });

  $('#sub-request-begin-time').timepicker({
    defaultTime: false
  });
  $('#sub-request-end-time').timepicker({
    defaultTime: false
  });

  
});