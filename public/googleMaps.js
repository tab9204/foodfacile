/**********Google maps related functions************/

var googleMapsDirections;//google maps directions url
var responseErrors = {// text responses for each map api response error
  INVALID_REQUEST: "This request was invalid.",
  OVER_QUERY_LIMIT: "App has reached max its request quota.",
  NOT_FOUND: "The referenced location was not found in the Places database.",
  REQUEST_DENIED: "The webpage is not allowed to use the PlacesService.",
  UNKNOWN_ERROR: "The PlacesService request could not be processed due to a server error. The request may succeed if you try again.",
  ZERO_RESULTS: "No result was found for this request."
};

//initiates a search for nearby restaurants
//serachRadius => radius in meters to serach
function initFoodSearch(searchRadius){
  return new Promise((resolve,reject) =>{
    googleMapsDirections = "https://www.google.com/maps/dir/?api=1&";//start building the google maps url
    getUserLocation()//get the users location
    .then((location) =>{
      googleMapsDirections += "origin="  + location + "&";//add user location to the url
      return searchForNearbyFood(location,searchRadius);//search for nearby restaurants with user location
    })
    .then((placeId) =>{
      googleMapsDirections += "destination='Food'&destination_place_id="+ placeId;//add restraunt destination to url
      return getFoodDetails(placeId);//get details on the restaurant
    })
    .then((foodDetails) =>{
       resolve(foodDetails);//return the restaurant details
    })
    .catch((error)=>{//return the error thrown
      reject(error);
    });
  })
}

//searchs nearby restraunts and returns a randomly selected restraunt ID
//location => current location of the user
//radius => radius around the user location to search for restaurant
function searchForNearbyFood(location,radius){
  return new Promise((resolve,reject) =>{
    var request = {//request info
      location: location,
      radius: radius,
      openNow: true,
      type: ['restaurant']
    };

    var service = new google.maps.places.PlacesService($(".mapContent").get(0));//google maps service used to run search queries

    service.nearbySearch(request, (results, status)=>{//run a nearby search with the request parameters
      if(status == "OK"){
        //randomly pick a restaurant from the returned list
        var max = results.length;
        var randomPick = Math.floor(Math.random() * Math.floor(max));
        var selected = results[randomPick];
        resolve(selected.place_id);//return the restaurants ID
      }
      else{
        reject(responseErrors[status]);//return the response error
      }
    })
  })
}
//get the details of a restaurant by restraunt id
function getFoodDetails(placeId){
  return new Promise((resolve,reject) =>{
    var request = {
      placeId: placeId,
      fields: ['name', 'formatted_phone_number', 'formatted_address', 'photos', 'website']
    };

    var service = new google.maps.places.PlacesService($(".mapContent").get(0));

    service.getDetails(request, (results, status)=>{//get the details of the restaurant
      if(status == "OK"){
        var image = results.photos !== undefined ? results.photos[0].getUrl() : "/public/logo.png";//if no image is returned use a default image
        var foodDetails = {
          name: results.name,
          address: results.formatted_address,
          phone: results.formatted_phone_number,
          website: results.website,
          directions: googleMapsDirections,
          picture: image
        }
        resolve(foodDetails);//return the details
      }
      else{
        reject(responseErrors[status]);//return the response error
      }
    })
  })
}

//returns  the user's current lat and long
function getUserLocation(){
  return new Promise((resolve,reject)=>{
    //check if the geolocation api is supported by the browswer
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{//ask user for their current location
        console.log(position.coords.latitude + " : " + position.coords.longitude);
        //location was found
        var position = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        resolve(position);

      },(error)=>{//there was an error finding the user's location
        reject("Denied access to user location");
      },{enableHighAccuracy: true})
    }
    else{//api is not supported
      reject("Browswer does not support the geolocation api");
    }
  })
}


export{initFoodSearch};
