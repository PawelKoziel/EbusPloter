(function () {
  //const apiAddress = "http://localhost:3001/api/temps";
  const apiAddress = "readme-date.json";
  var allData;
  var GET_DATA_DELAY = 2000;

  function getData(start, end, callback) {
    if (!allData) {
      initializeData(function () {
        getDataSubset(start, end, callback);
      });
      return;
    }
    getDataSubset(start, end, callback);
  }

  function initializeData(callback) {
    d3.json(apiAddress, function (err, data) {
      allData = data;
      callback();
    });
  }

  function getDataSubset(start, end, callback) {
    var data = _.filter(allData, between("datetime", start, end));
    setTimeout(function () {
      callback(null, data);
    }, GET_DATA_DELAY);
  }

  function between(attrName, min, max) {
    return function (d) {
      return d[attrName] >= min && d[attrName] <= max;
    };
  }

  window.store = {
    getData: getData,
  };
})();
