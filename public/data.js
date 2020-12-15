/**********Data for rendering app views************/

import {searchForNearbyFood, getFoodDetails, getUserLocation} from './googleMaps.js';

var google_maps_directions;//google maps directions url

var food_details = {//details of the selected restaurant to display on the food screen
  name: null,
  address: null,
  phone: null,
  website: null,
  directions: null,
  picture: null
}

var radius_slider =[//the values and text associated with the search radius slider
  {radiusInMeters: "600", textToDisplay: "< 1 mile"},
  {radiusInMeters: "3219", textToDisplay: "2 miles"},
  {radiusInMeters: "8047", textToDisplay: "5 miles"},
  {radiusInMeters: "50000", textToDisplay: "> 10 miles"}
];

var radius_slider_display_text = radius_slider[0].textToDisplay;//text to display above the radius slider
var radius_slider_value = 0;//the value of the slider html input
var search_radius = radius_slider[0].radiusInMeters;//radius to use in the food search

var response_errors = {// text responses for each potential error
  INVALID_REQUEST: "This request was invalid. Try again",
  OVER_QUERY_LIMIT: "App has reached max its request quota.",
  NOT_FOUND: "The referenced location was not found in the Places database.",
  REQUEST_DENIED: "The webpage is not allowed to use the PlacesService API.",
  UNKNOWN_ERROR: "This request could not be processed due to a server error. Try again.",
  ZERO_RESULTS: "No restraunts were found at this time. Try again",
  UNSUPPORTED_BROWSER: "Browser does not support the geolocation api",
  DENIED_GEOLOCATION: "Denied access to user location",
};
var error_Thrown = "";//error to show on the error screen

//initalizes the search radius slider
function initSliders(){
  //add options to the sliders
  $('input.radiusSlider').rangeslider({
    polyfill: false,
    onSlide: function(position, value) {
      radius_slider_display_text = radius_slider[value].textToDisplay;
      search_radius = radius_slider[value].radiusInMeters;
      radius_slider_value = value;
      m.redraw();//need to manually redraw the view
    }
  })
}

//initiates a search for nearby restaurants
//serachRadius => radius in meters to serach
//priceLevel => price amount to limit search to
function initFoodSearch(searchRadius){
  window.location = "#!/loading";//show the loading screen while the requests are being made
  google_maps_directions = "https://www.google.com/maps/dir/?api=1&";//start building the google maps url
  getUserLocation()//get the users location
  .then((location) =>{
    google_maps_directions += "origin="  + location + "&";//add user location to the url
    return searchForNearbyFood(location,searchRadius);//search for nearby restaurants with user location
  })
  .then((place_Id) =>{
    google_maps_directions += "destination='Food'&destination_place_id="+ place_Id;//add restraunt destination to url
    return getFoodDetails(place_Id);//get details on the restaurant
  })
  .then((details) =>{
    var foodImage = details.photos !== undefined ? details.photos[0].getUrl() : "/public/logo.png";//if no image is returned use a default image
    food_details = {// update the food details object with the recieved details
      name: details.name,
      address: details.formatted_address,
      phone: details.formatted_phone_number,
      website: details.website,
      directions: google_maps_directions,
      picture: foodImage
    }
    window.location = "#!/food";//update the url to show the food screen
  })
  .catch((error)=>{//return the error thrown
    error_Thrown = response_errors[error];
    window.location = "#!/error";
  });
}

export{initSliders, radius_slider_display_text, radius_slider_value, search_radius, initFoodSearch, food_details, error_Thrown};
