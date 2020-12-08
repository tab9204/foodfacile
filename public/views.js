/*****app views****/

import {initFoodSearch} from './googleMaps.js';

//Food screen variables
var foodName;
var foodAddress;
var foodPhone;
var foodWebsite;
var foodDirections;
var foodPicture;

//main screen variables
var searchRanges =[//the range of possible serach radius and the one screen text for those values
  {radiusInMeters: "600", textToDisplay: "< 1 mile"},
  {radiusInMeters: "3219", textToDisplay: "2 miles"},
  {radiusInMeters: "8047", textToDisplay: "5 miles"},
  {radiusInMeters: "50000", textToDisplay: "> 10 miles"}
];
var searchText;//text to display above the search radius slider

//error screen variables
var errorThrown = "";

/**Compenents**/
var header = {//default header
  view:()=>{
    return m("header",[
      m("div.centerText","What Food?")
    ])
  }
}

var headerBack = {//header with back button
  view:()=>{
    return m("header",[
      m("img.backBtn.scaleAnimation", {src: "/public/back.png", onclick: ()=>{window.location = "#!/main"}}),
      m("div.centerText","What Food?")
    ])
  }
}

var main = {//main screen
  oninit: ()=>{
    searchText = searchRanges[0].textToDisplay;//initalize the search radius text
  },
  oncreate: ()=>{
    //add options to the slider
    $('input.slider').rangeslider({
      polyfill: false,
      onSlide: function(position, value) {
        searchText = searchRanges[value].textToDisplay;
        m.redraw();
      }
    })
  },
  view: ()=>{
    return m("mainScreen", [
      m(header),
      m("viewContent", [
        m("div.contentContainer.font_size_1_3", "Select a serach radius size and then hit the Find Something button to find a nearby restaurant"),
        m("div.contentContainer.centerText", [
          m("div.sliderValue.font_size_1_3", searchText),
          m("input.slider",{type: "range", min: 0, max: 3, value: 0}),
        ]),
        m("div.contentContainer",[
          m("div.button.center.font_size_1_5",{onclick: ()=>{
            window.location = "#!/loading";//show the loading screen while the requests are being made
            var searchRadius = searchRanges[$("input.slider").val()].radiusInMeters;//use slider value as search radius
            initFoodSearch(searchRadius).then((details)=>{
               foodName = details.name;
               foodAddress = details.address;
               foodPhone = details.phone;
               foodWebsite = details.website;
               foodDirections = details.directions;
               foodPicture = details.picture;
               window.location = "#!/food";//update the url to show the food screen
            })
            .catch((error)=>{//update and show error screen
              errorThrown = error;
              window.location = "#!/error";
            });
          }},"Find Something")
        ])
      ])
    ])
  }
}

var food = {//selected restaurant screen
  oncreate: ()=>{//animate the nodes after the are created
    $( ".textContent" ).fadeIn(1000,()=>{//fade in text content
      $( ".buttonContent" ).fadeIn(500,()=>{//buttons
        $( "foodScreen .backBtn" ).fadeIn(100);//fade in back button
      });
    });
  },
  view: () =>{
    return m("foodScreen",[
      m(headerBack),
      m("viewContent",[
        m("div.imgContainer",[
          m("img", {src: foodPicture, onload:()=>{$( ".imgContainer img" ).fadeIn(500)}})//after the image has loaded fade it in
        ]),
        m("div.contentContainer.textContent", [
          m("div.font_size_1_3",foodName),
          m("div",foodAddress),
          m("div",foodPhone),
        ]),
        m("div.contentContainer.font_size_1_5.center.buttonContent",[
          m("div",[
            m("a.button", {href: foodWebsite, target: "_blank"},"Website"),
            m("a.button", {href: foodDirections, target: "_blank", style: {margin: "0 0 0 10px"}},"Directions")
          ])
        ])
      ])
    ])
  }
}

var error = {//screen showing thrown errors
  view: () =>{
    return m("errorScreen",[
      m(headerBack),
      m("viewContent",[
        m("div.contentContainer.centerText.font_size_1_5",errorThrown)
      ])
    ])
  }
}

var loading ={//screen to show while requests are loaded
  oncreate: ()=>{
    history.replaceState(null, "main", "#!/main");//update browers history to skip the loading screen if the back button is used
  },
  view: () =>{
    return m("loadingScreen",[
      m("viewContent",[
        m("div",[
          m("img", {src: "/public/logo.png"})
        ])
      ])
    ])
  }
}


export{main, food, loading, error};
