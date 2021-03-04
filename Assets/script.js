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