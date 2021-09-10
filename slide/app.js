(function () {
  var chart = window.chart;
  var store = window.store;

  // Global application state
  var state = {};

  var INITIAL_START_DATETIME = "2021-08-25T00:00:00";

  function start() {
    chart.create();

    chart.setHandlers({
      // No need to update state on translate too often
      onTranslate: _.throttle(handleTranslate, 500),
      onClickPagingButton: handleClickPagingButton,
    });

    var start = INITIAL_START_DATETIME;
    var end = addToDatetime(start, "hours", 24);
    state.start = start;
    state.end = end;
    state.location = addToDatetime(start, "hours", 3);
    state.loading = true;

    logStateChange("draw");
    chart.draw(state);

    store.getData(start, end, function (err, data) {
      state.data = data;
      state.loading = false;

      logStateChange("draw");
      chart.draw(state);
    });
  }

  function handleTranslate(d) {
    state.location = d.location;
    logStateChange("handleTranslate");
  }

  function handleClickPagingButton(d) {
    state.location = d.location;
    logStateChange("handleClickPagingButton " + d.name);

    state.loading = true;

    logStateChange("draw");
    chart.draw(state);

    var deltaUnit = "hours";
    var deltaQuantity = 12;

    if (d.name === "left") {
      deltaQuantity = -deltaQuantity;
    }

    var start = addToDatetime(state.start, deltaUnit, deltaQuantity);
    var end = addToDatetime(state.end, deltaUnit, deltaQuantity);
    state.start = start;
    state.end = end;

    store.getData(start, end, function (err, data) {
      state.data = data;
      state.loading = false;

      logStateChange("draw");
      chart.draw(state);
    });
  }

  function addToDatetime(datetime, key, quantity) {
    return moment(datetime).add(key, quantity).format("YYYY-MM-DDTHH:mm:ss");
  }

  function logStateChange(msg) {
    msg = msg || "State change";
    console.log(msg, state);
  }

  window.app = {
    state: state,
    start: start,
  };
})();



