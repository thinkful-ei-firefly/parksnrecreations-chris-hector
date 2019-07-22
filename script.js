'use strict'

let api_key='bujPhndNRqoU8ciylRfXIKdg59yarR7O6sqOsrWT';

function callStateList(){
    fetch(`https://developer.nps.gov/api/v1/parks?&api_key=${api_key}`)
    .then(response => {
      return response.json()
    })
    .then(allStatesResponse => {
      loadDropDown(allStatesResponse)
    })
    .catch(error => console.log(error))
  }

  function callParksApi(stateSelected,numResults){
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${stateSelected}&limit=${numResults-1}&api_key=bujPhndNRqoU8ciylRfXIKdg59yarR7O6sqOsrWT`)
    .then(results =>
      results.json())
    .then(newResults =>
      displayResults(newResults)
    )
    .catch(error => console.log(error))
  }
  /*
  function loadDropDown(allStates){
    console.log(allStates);
    $('.select-dropdown').empty();
    for(let i = 0; i < allStates.data.length; i++){
      let states = allStates.data[i].states;
      console.log(states);
  
      $('.select-dropdown').append(
        `
        <option class="dropdown-style" value="${states}">
          ${states}
        </option>
        `
        );
    }
    $(".select-dropdown").removeClass("hidden");
  }
*/
function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
    console.log(responseJson);
    // Clearing previous results
    $('.js-error-message').empty();
    $('.results-list').empty();
    // Looping through the response and formatting results
    for (let i = 0; i < responseJson.data.length & i < maxResults; i++) {
        $('.results-list').append(`<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
        <p>${responseJson.data[i].description}</p>
        </li>`);
    }
    $('.results').removeClass('hidden');
}

function getParks(baseUrl, stateArr, maxResults, apiKey) {
    // Setting up parameters
    const params = {
        stateCode: stateArr,
        limit: maxResults
    }
    // Creating url string
    const queryString = formatQueryParams(params);
    const url = baseUrl + '?' + queryString + '&api_key=' + apiKey;
    console.log(url);
    /*const options = {
        headers: new Headers({'X-API-Key': apiKey})
    };*/
    // Fetch information, if there's an error display a message
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
        $('.js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

// Watch search form for submit, call getParks
function watchForm() {
    $('.js-form').on('submit', function() {
        event.preventDefault();
        const baseUrl = 'https://api.nps.gov/api/v1/parks'
        const stateArr = $('#js-search-term').val().split(",");
        const maxResults = $('#js-max-results').val();
        // Insert your own NPS API key for the value of apiKey.
        const apiKey = 'INSERT API KEY HERE'
        getParks(baseUrl, stateArr, maxResults, apiKey);
    })
}

$(watchForm);