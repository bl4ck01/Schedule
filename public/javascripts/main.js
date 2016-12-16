const timepickerDefaults = {
  defaultTime: false,
};

$(document).ready(() => {
  let shifts = [];
  // FIXME: Move shifts to Redis cache and retrieve from there
  $.get('/events/get/all', (data) => {
    if (data.length > 0) {
      shifts = data;
    }
  })
  .done(() => {
    const cal = $('#calendar');
    const template = $('#temp-cal');

    /**
     * Bring up the sub request form
     */
    function showSubRequestForm(event) {
      $('#sub-request-shift').attr('value', event.start.format('MMMM Do, YYYY'));
      $('#sub-request-begin-time').timepicker('setTime', event.start.format('hh:mm a'));
      $('#sub-request-end-time').timepicker('setTime', event.end.format('hh:mm a'));
      $('#sub-request-div').show();
    }

    // initialize calendar
    cal.fullCalendar({
      // automatically resize calendar when browser window resizes
      handleWindowResize: true,
      timeFormat: 'h(:mm)t',
      // emphasizes time slots on agenda view if configured for objects
      // see http://fullcalendar.io/docs/display/businessHours/
      businessHours: {
        start: '08:00:00',
        end: '22:00:00',
        dow: [1, 2, 3, 4],
      },
      // limits the number of events displayed on a day.
      // A value of true will limit the number of events to the height of the day cell.
      // An integer value will limit the events to a specific number of rows.
      eventLimit: true,
      selectable: false,
      selectHelper: true,
      unselectAuto: true, // TODO: see unselectCancel options: http://fullcalendar.io/docs/selection/unselectCancel/,
      nowIndicator: true,

      buttonText: {
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      events: shifts,

      // construct custom buttons that can be used in the calendar header
      customButtons: {
        clockIn: {
          text: 'Clock in',
          click: () => {
            location.assign('/clock/in');
          },
        },
        subs: {
          text: 'Sub Requests',
          click: () => {
            location.assign('/shifts/requests');
          },
        },
        manage: {
          text: 'Manage',
          click: () => {
            location.assign('/admin');
          },
        },
      },

      header: {
        left: 'month,agendaWeek,agendaDay',
        center: 'title',
        right: 'manage clockIn,subs today prev,next',
      },

      // specify options applicable to only certain views
      // define custom views
      views: {
        agendaWeek: {
          minTime: '08:00:00',
          maxTime: '22:00:00',
          slotEventOverlap: false,
        },
        agendaDay: {
          minTime: '08:00:00',
          maxTime: '22:00:00',
          slotEventOverlap: false,
        },
        month: {
          slotEventOverlap: false,
        },
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
      },
    });

    // initialize weekly template calendar
    template.fullCalendar({
      // automatically resize calendar when browser window resizes
      handleWindowResize: true,
      timeFormat: 'h(:mm)t',
      // emphasizes time slots on agenda view if configured for objects
      // see http://fullcalendar.io/docs/display/businessHours/
      businessHours: {
        start: '08:00:00',
        end: '22:00:00',
      },
      // limits the number of events displayed on a day.
      // A value of true will limit the number of events to the height of the day cell.
      // An integer value will limit the events to a specific number of rows.
      eventLimit: true,
      selectable: true,
      selectHelper: true,
      unselectAuto: true, // TODO: see unselectCancel options: http://fullcalendar.io/docs/selection/unselectCancel/,
      nowIndicator: true,

      buttonText: {
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      events: [],

      header: {
        left: 'month,agendaWeek,agendaDay',
        center: 'title',
        right: 'today prev,next',
      },

      // specify options applicable to only certain views
      // define custom views
      views: {
        agendaWeek: {
          minTime: '08:00:00',
          maxTime: '22:00:00',
          slotEventOverlap: false,
        },
        agendaDay: {
          minTime: '08:00:00',
          maxTime: '22:00:00',
          slotEventOverlap: false,
        },
        month: {
          slotEventOverlap: false,
        },
      },
      defaultView: 'agendaWeek',

      // functions applicable to the calendar
      dayClick: (date, jsEvent, view) => {
        // TODO: Replace logic with switch to day/week view from week/month views
        if (view.name === 'month' || view.name === 'week') {
          cal.fullCalendar('gotoDate', date);
          cal.fullCalendar('changeView', 'agendaDay');
        } else if (view.name === 'day') {

        }
      },

      eventClick: (event, jsEvent, view) => {
        showSubRequestForm(event);
      },
    });

    /**
     * Clear and close the sub request form
     */
    $('#close-sub-request').click(() => {
      $('#sub-request-div').hide(() => {
        $('#sub-request-shift').attr('value', '');
        $('#sub-request-begin-time').timepicker('setTime', '');
        $('#sub-request-end-time').timepicker('setTime', '');
      });
    });

    $('#sub-request-begin-time').timepicker(timepickerDefaults);
    $('#sub-request-end-time').timepicker(timepickerDefaults);
    $('#shift-create-begin-time').timepicker(timepickerDefaults);
    $('#shift-create-end-time').timepicker(timepickerDefaults);
    $('#settings-default-time-start').timepicker(timepickerDefaults);
    $('#settings-default-time-end').timepicker(timepickerDefaults);

    /**
     * Hide shift creation/override forms
     */
    $('#override-shift').click(() => {
      const btn = $('#override-shift');
      if (!btn.hasClass('active')) {
        $('#create-shift').removeClass('active');
        $('#shift-creation').collapse('hide');
        btn.addClass('active');
      } else {
        btn.removeClass('active');
      }
    });

    $('#create-shift').click(() => {
      const btn = $('#create-shift');
      if (!btn.hasClass('active')) {
        $('#override-shift').removeClass('active');
        $('#shift-override').collapse('hide');
        btn.addClass('active');
      } else {
        btn.removeClass('active');
      }
    });

    /**
     * Retrieve and display modify shift form results
     */
    $('#modify-search-form-btn').click(() => {
      const results = document.getElementById('shift-override-results');
      $('#shift-override-table').fadeOut();
      const date = $('#override-date').val();
      const owner = $('#override-shift-owner').val();
      const beginTime = $('#sub-request-begin-time').val();
      const endTime = $('#sub-request-end-time').val();
      $.get(`/shifts/get?date=${date}&owner=${owner}&beginTime=${beginTime}&endTime=${endTime}`,
        (data) => {
          if (data.length > 0) {
            // TODO: populate table with results
          } else {
            $('#shift-override-results').find('tr').remove();
            const notFound = results.insertRow(0).insertCell(0);
            notFound.innerHTML =
              '<b style="color: red">No shifts were found with the current search criteria.</b>';
            $('#shift-override-table').fadeIn();
            // Delay execution of trigger until after done() procedures have completed.
            process.nextTick(() => {
              $('#modify-search-again-btn').trigger('click');
            });
          }
        })
        .done(() => {
          $('#modify-search-form').hide();
          $('#override-date').val('');
          $('#override-shift-owner').val('');
          $('#sub-request-begin-time').val('');
          $('#sub-request-end-time').val('');
          $('#modify-submit-form').fadeIn();
        })
        .fail((xhr) => {
          $('#shift-override-results').find('tr').remove();
          const errOccurred = results.insertRow(0).insertCell(0);
          errOccurred.innerHTML =
            `<b style="color: red">Error: ${JSON.parse(xhr.responseText)[0].msg}</b>`;
          $('#shift-override-table').fadeIn();
        });
    });

    $('#modify-search-again-btn').click(() => {
      $('#modify-submit-form').hide();
      $('#override-shift-replacement').val('');
      $('#sub-update-begin-time').val('');
      $('#sub-update-end-time').val('');
      $('#modify-search-form').fadeIn();
    });

    /**
     * Modifies the Default Time range in Settings accordion->Default Time
     */
    $('#settings-default-time-semester-btn').click(() => {
      $('#settings-default-time-range').val('116');
    });
    $('#settings-default-time-year-btn').click(() => {
      $('#settings-default-time-range').val('260');
    });
  });
});
