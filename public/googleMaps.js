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
        reject(status);//return the response error
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
        console.log(position.coords.latitude + " : " + position.coords.longitude);
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


export{searchForNearbyFood, getFoodDetails, getUserLocation};
