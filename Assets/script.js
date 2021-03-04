let searchBtn = $(".search-button");
let searchInput = $("#search-input");
let oneDayResult = $("#one-day-result");
let listGroup = $("#recent-searches");
let fiveDayResult = $("#five-day-result");
let fiveDayTitle = $("#five-day-title");

let recentCities = [];

let apiKey = "5178dc0fce8514b75d7a89420078fe33";

searchBtn.on("click", () => {
    let zipCode = searchInput.val();
    let lat;
    let lon;
    let fiveDayLink = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${apiKey}&units=imperial`;
    fetch(fiveDayLink)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("Invalid Zip Code, Please Enter a Valid Zip Code.");
        }
      })
      .then((data) => {
        populateOneDay(data);
        checkRecentCities(data, zipCode);
        populateFiveDay(data);
        writeRecentCities();
        lat = data.city.coord.lat;
        lon = data.city.coord.lon;
        let oneCallLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
        fetchUV(oneCallLink);
      })
      .catch((error) => {
        alert(error);
      });
  });
  
  $(document).on("click", function (e) {
    if (e.target.id == "recent-city") {
      let zipCode = e.target.getAttribute("zip");
      let lat;
      let lon;
      let fiveDayLink = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${apiKey}&units=imperial`;
      fetch(fiveDayLink)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } 
        })
        .then((data) => {
          populateFiveDay(data);
          populateOneDay(data);
          checkRecentCities(data, zipCode);
          writeRecentCities();
          lat = data.city.coord.lat;
          lon = data.city.coord.lon;
          let oneCallLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
          fetchUV(oneCallLink);
        })
        .catch((error) => {
          alert(error);
        });
    }
  });
  
  function fetchUV(link) {
    fetch(link)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } 
      })
      .then((data) => {
        let uv = $("<p>");
        let indexValue = $("<span>");
        indexValue.text(data.current.uvi);
        colorUv(data.current.uvi, indexValue);
        uv.addClass("card-text result-p");
        uv.text(`UV Index: `);
        uv.append(indexValue);
        oneDayResult.append(uv);
      })
      .catch((error) => {
        alert(error);
      });
  }
  
  function colorUv(val, el) {
    if (val < 3) {
      el.addClass("uv-low");
    } else if (val < 6) {
      el.addClass("uv-med");
    } else if (val < 10) {
      el.addClass("uv-high");
    } else {
      el.addClass("uv-danger");
    }
  }
  
  function writeRecentCities() {
    listGroup.empty();
    for (let i = 0; i < recentCities.length; i++) {
      let html = `<li class="list-group-item recent-city" id="recent-city" zip="${recentCities[i].zip}">${recentCities[i].name}</li>`;
      listGroup.append(html);
    }
  }
  
  function checkRecentCities(data, zip) {
    let city = {
      name: data.city.name,
      zip: zip,
    };
  
    for (let i = 0; i < recentCities.length; i++) {
      if (recentCities[i].zip == zip) {
        recentCities.splice(i, 1);
      }
    }
  
    if (recentCities.length < 5) {
      recentCities.unshift(city);
    } else {
      recentCities.pop();
      recentCities.unshift(city);
    }
  
    localStorage.setItem("recent", JSON.stringify(recentCities));
  }
  
  function init() {
    if (localStorage.getItem("recent") !== null) {
      let retrievedData = localStorage.getItem("recent");
      recentCities = JSON.parse(retrievedData);
      writeRecentCities();
    }
  }
  
  function populateOneDay(data) {
    oneDayResult.removeClass("hide");
    oneDayResult.empty();
    let cityName = data.city.name;
    let listItem = data.list[0];
    let id = data.list[0].weather[0].id;
    id = id.toString();
  
  
    let html =
      `<h2>${cityName} ${unixToDate(listItem.dt)}</h2>` +
      `<p class="result-p">Temp: ${listItem.main.temp.toFixed(0)}&degF</p>` +
      `<p class="result-p">Humidity: ${listItem.main.humidity}%</p>` +
      `<p class="result-p">Wind: ${listItem.wind.speed} MPH</p>`;
  
    oneDayResult.append(html);
  }
  