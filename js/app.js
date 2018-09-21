/*
 Foursquare API Constants.
 */
var SEARCH_LIMIT = 20;
var CLIENT_SECRET = "LEF3BO5TX2WFHKXCPE4URBDMFEIUM1XWOJZFEWNZGMIYZRD5";
var CLIENT_ID = "SDNP0JJPPKBKKG11KRSF13ROYLCFMV21UFO0V0EOQV3EZYGN";
var FSQ_URL =
  "https://api.foursquare.com/v2/venues/search?&client_id=" +
  CLIENT_ID +
  "&client_secret=" +
  CLIENT_SECRET +
  "&near=Pune&limit=" +
  SEARCH_LIMIT;

var map = null;

/*
 * @description Error handler for loading of Google Maps APIs.
 * */
function mapLoadingError() {
  alertify.error(
    "Failed to load Google Maps <br /> Please check your internet connection."
  );
}

/*
 * @description The Starting Point
 */
function startApp() {
  //viewModel = new AppViewModel();
  //ko.applyBindings(viewModel);

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });

  //infoWindow = new google.maps.InfoWindow();
  //viewModel.loadLocations(FSQ_REQUEST_URL);
  // Subscribe to filteredLocations, change Map Items when it's changed.
  //viewModel.filteredLocations.subscribe(function () {
  //editMap();
  //});
}
