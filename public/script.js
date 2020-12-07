import {main, food, loading, error} from './views.js';

window.onload = () =>{
  //set up the service worker once the page loads
  //if ('serviceWorker' in navigator) {navigator.serviceWorker.register('service-worker.js');}

  window.location = "#!/main";//start the app on the main screen

  var root = $("#appRoot").get(0)

  // Try it out! This is just to
  // help get things started.
  m.route(root, "/main",{
    "/food": food,
    "/main": main,
    "/loading": loading,
    "/error": error
  })


}
