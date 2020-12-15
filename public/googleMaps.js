/**********Google maps related functions************/


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

    var next_page_threshold = 6;//used to determine if the results returned will come from the current page or the next page

    var service = new google.maps.places.PlacesService(document.getElementsByClassName("mapContent")[0]);//google maps service used to run search queries

    service.nearbySearch(request, (results, status, next_page_token)=>{//run a nearby search with the request parameters
      var diceResult = rollDice(1,10);//roll the dice to see if we are selecting the next page of results
      console.log(results);
      if(next_page_token.hasNextPage && diceResult > next_page_threshold){//get the the next page of results if there is one and the dice roll is above the threshold
        setTimeout(() => {
          next_page_token.nextPage();
        },2000);//the token is not immediately active so wait briefly before trying to use it
      }
      else{//use the current page of results
        if(status == "OK"){
          //randomly pick a restaurant from the returned list
          var max = results.length;
          var randomPick = Math.floor(Math.random() * Math.floor(max));
          var selected = results[randomPick];
          resolve(selected.place_id);//return the restaurants ID
        }
        else{
          reject(status);//return the response error
        }
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

    var service = new google.maps.places.PlacesService(document.getElementsByClassName("mapContent")[0]);

    service.getDetails(request, (results, status)=>{//get the details of the restaurant
      if(status == "OK"){
        resolve(results);//return the details
      }
      else{
        reject(status);//return the response error
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
        //location was found
        var position = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        resolve(position);

      },(error)=>{//there was an error finding the user's location
        reject("DENIED_GEOLOCATION");
      },{enableHighAccuracy: true})
    }
    else{//api is not supported
      reject("UNSUPPORTED_BROWSER");
    }
  })
}

//picks a number basd on a range provided
function rollDice(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export{searchForNearbyFood, getFoodDetails, getUserLocation};
