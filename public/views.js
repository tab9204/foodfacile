/*****app views****/
import * as viewData from './data.js';


/**Compenents**/
var header = {//default header
  view:()=>{
    return m("header",[
      m("img.backBtn.scaleAnimation", {alt: "navigate back",src: "/public/back.png", onclick: ()=>{window.location = "#!/main"}}),
      m("div.centerText","FoodFacile")
    ])
  }
}


var main = {//main screen
  oncreate: viewData.initSliders,//initalize the sliders on component creation
  view: ()=>{
    return m("mainScreen", [
      m(header),
      m("viewContent", [
        m("div.contentContainer.font_size_1_3", "No more crippling indecision! Select a max travel distance and have a nearby restaurant picked for you!"),
        m("div.contentContainer", [
          m("div.sliderText.centerText.font_size_1_3", viewData.radius_slider_display_text),
          m("input.radiusSlider",{title: "travel distance slider" ,type: "range", min: 0, max: 3, value: viewData.radius_slider_value}),//prevent slider value from using default value on redraw
        ]),
        m("div.contentContainer",[
          m("div.button.center.font_size_1_7",{onclick: () =>{viewData.initFoodSearch(viewData.search_radius)} },"Find Food")
        ])
      ])
    ])
  }
}

var food = {//selected restaurant screen
  oncreate: ()=>{//animate the nodes after the are created
      $( ".textContent").fadeIn(1000,()=>{//fade in text content
        $( ".buttonContent").fadeIn(500,()=>{//buttons
          $("foodScreen .backBtn").fadeIn(100);//fade in back button
        });
      });
  },
  view: () =>{
    return m("foodScreen",[
      m(header),
      m("viewContent",[
        m("div.imgContainer",[
          m("img", {src: viewData.food_details.picture, alt: "restaurant image from google maps", onload:()=>{$(".imgContainer img").fadeIn(500)}})//after the image has loaded fade it in
        ]),
        m("div.contentContainer.textContent", [
          m("div.font_size_1_3",viewData.food_details.name),
          m("div",viewData.food_details.address),
          m("div",viewData.food_details.phone),
        ]),
        m("div.contentContainer.font_size_1_5.center.buttonContent",[
          m("div",[
            m("a.button", {href: viewData.food_details.website, target: "_blank"},"Website"),
            m("a.button", {href: viewData.food_details.directions, target: "_blank", style: {margin: "0 0 0 10px"}},"Directions")
          ])
        ])
      ])
    ])
  }
}

var error = {//screen showing thrown errors
  oncreate: ()=>{//animate the nodes after the are created
    $( "errorScreen .backBtn").fadeIn(100);//fade in back button
  },
  view: () =>{
    return m("errorScreen",[
      m(header),
      m("viewContent",[
        m("div.contentContainer.centerText.font_size_1_5",viewData.error_Thrown)
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
          m("img.fadeInAndOut", {alt: "loading", src: "/public/logo.png", onload:()=>{$("img").show()}})
        ])
      ])
    ])
  }
}


export{main, food, loading, error};
