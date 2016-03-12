$(document).ready(() => {
  const cal = $('#calendar');
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
    selectable: true,
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
      //{
      //  start: '',
      //  end: '',
      //  rendering: 'background'
      //}
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
      if (view.name === 'month') {
        cal.fullCalendar('gotoDate', date);
        cal.fullCalendar('changeView', 'agendaDay');
      } else {
        subRequestForm(date, jsEvent, view);
      }
    },

    eventClick: (event, jsEvent, view) => {
      //TODO: Launch window displaying more details about the Assigned_Shift referenced by the event
      //TODO: Window will have button to drop the shift
    },
    select: (start, end, jsEvent, view) => {

    },
    unselect: (view, jsEvent) => {
      hideSubRequestForm();
    }
  });

  let subRequestActive = false;

  /**
   * Brings up the sub request form
   */
  function showSubRequestForm(date) {
    $('#sub-request-shift').html(date.format('MMM DD, YYYY'));
    $('#sub-request-div').show();
    subRequestActive = true;
  }

  /**
   * Hides and clears the sub request form
   */
  function hideSubRequestForm() {
    subRequestActive = false;
  }

  /**
   * Acts on the sub request form
   */
  function subRequestForm(date) {
    if (subRequestActive) {
      hideSubRequestForm();
    } else {
      showSubRequestForm(date);
    }
  }

});