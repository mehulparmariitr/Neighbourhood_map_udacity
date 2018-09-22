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

var Model = function (data) {
  var self = this;

  this.name = data.name;
  this.lng = data.lng;
  this.lat = data.lat;
  this.loc = data.loc;
  this.state = data.state;
  this.country = data.country;
  this.url = data.url;

  this.address = ko.pureComputed(function () {
    if ((self.loc && self.state && self.country) !== undefined)
      return self.loc + ", " + self.state + ", " + self.country;
    else return "No address found";
  });

  this.marker = data.marker;
  this.visibleMarker = ko.observable(true);
  this.infoWindowContent = data.infoWindowContent;
};


var viewModel = function (data) {
  var self = this;

  this.locations = ko.observableArray();

  this.getLocations = function (url) {
    $.getJSON(url, function (data) {

      var venues = data.response.venues;

      venues.forEach(function (venue) {
        var marker = new google.maps.Marker({
          map: null,
          animation: google.maps.Animation.DROP,
          position: { lat: venue.location.lat, lng: venue.location.lng },
          title: venue.name
        });
        var ModelVenue = new Model({
          'state': venue.location.state,
          'country': venue.location.country,
          'url': venue.url,
          'marker': marker,
          'name': venue.name,
          'lat': venue.location.lat,
          'lng': venue.location.lng,
          'loc': venue.location.address
        });
        ModelVenue.infoWindowContent = createInfoWindow(ModelVenue);

        self.locations.push(ModelVenue);
      });

      // Re-Load the markers on the map once the data arrives.
      setupMarkers();
    }).fail(function (jqXHR, textStatus, error) {
      alertify.error('Error in getting data <br />' + error);
    });
  };

}

/*
 * @description Error handler for loading of Google Maps APIs.
 * */
function GooglemapLoadingError() {
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

  infoWindow = new google.maps.InfoWindow();
  //viewModel.loadLocations(FSQ_REQUEST_URL);
  // Subscribe to filteredLocations, change Map Items when it's changed.
  //viewModel.filteredLocations.subscribe(function () {
  //editMap();
  //});
}
