/*
 Foursquare API Constants.
 */
var SEARCH_LIMIT = 25;
var CLIENT_SECRET = "LEF3BO5TX2WFHKXCPE4URBDMFEIUM1XWOJZFEWNZGMIYZRD5";
var CLIENT_ID = "SDNP0JJPPKBKKG11KRSF13ROYLCFMV21UFO0V0EOQV3EZYGN";
var FSQ_URL =
  "https://api.foursquare.com/v2/venues/search?&client_id=" +
  CLIENT_ID +
  "&client_secret=" +
  CLIENT_SECRET +
  "&near=Pune&v=20180922&limit=" +
  SEARCH_LIMIT;

var map = null;

//model for the program
var Model = function(data) {
  var self = this;

  this.name = data.name;
  this.lng = data.lng;
  this.lat = data.lat;
  this.loc = data.loc;
  this.state = data.state;
  this.country = data.country;
  this.url = data.url;

  this.address = ko.pureComputed(function() {
    if ((self.loc && self.state && self.country) !== undefined)
      return self.loc + ", " + self.state + ", " + self.country;
    else return "No address found";
  });

  this.marker = data.marker;
  this.visibleMarker = ko.observable(true);
  this.infoWindowContent = data.infoWindowContent;
};

// ViewModel for the program
var viewModel = function(data) {
  var self = this;

  this.locations = ko.observableArray();

  this.hamburgerMenuShown = ko.observable(false);
  this.showHamburgerMenu = function() {
    this.hamburgerMenuShown(!this.hamburgerMenuShown());
  };
  this.filterText = ko.observable("");

  this.getLocations = function(url) {
    $.getJSON(url, function(data) {
      var venues = data.response.venues;

      venues.forEach(function(venue) {
        var marker = new google.maps.Marker({
          map: null,
          animation: google.maps.Animation.DROP,
          position: { lat: venue.location.lat, lng: venue.location.lng },
          title: venue.name
        });
        var ModelVenue = new Model({
          state: venue.location.state,
          country: venue.location.country,
          url: venue.url,
          marker: marker,
          name: venue.name,
          lat: venue.location.lat,
          lng: venue.location.lng,
          loc: venue.location.address
        });
        ModelVenue.infoWindowContent = createInfoWindow(ModelVenue);

        self.locations.push(ModelVenue);
      });

      // Re-Load the markers on the map once the data arrives.
      setupMarkers();
    }).fail(function(jqXHR, textStatus, error) {
      alertify.error("Error in getting data <br />" + error);
    });
  };

  this.filterLocations = ko.computed(function() {
    var ans = [];
    for (var i = 0; i < self.locations().length; i++) {
      var currLoc = self.locations()[i];
      if (
        currLoc.name.toLowerCase().indexOf(self.filterText().toLowerCase()) !==
        -1
      ) {
        currLoc.visibleMarker(true);
        ans.push(currLoc);
      } else {
        currLoc.visibleMarker(false);
      }
    }
    return ans;
  });

  this.showItemInfo = function(e) {
    infoWindow.setContent(e.infoWindowContent);
    infoWindow.open(map, e.marker);
    toggleBounce(e.marker);

    map.panTo(e.marker.getPosition());
  };
};

function setupMarkers() {
  var bounds = new google.maps.LatLngBounds();
  viewModel.locations().forEach(function(currentLocation) {
    bounds.extend(currentLocation.marker.position);
    currentLocation.marker.setMap(map);
    currentLocation.marker.addListener(
      "click",
      (function(currentLocation) {
        return function() {
          infoWindow.setContent(currentLocation.infoWindowContent);
          infoWindow.open(map, currentLocation.marker);
          toggleBounce(currentLocation.marker);
        };
      })(currentLocation)
    );
  });

  map.fitBounds(bounds);
}

/*
 * @description Error handler for loading of Google Maps APIs.
 * */
function GooglemapLoadingError() {
  alertify.error(
    "Failed to load Google Maps <br /> Please check your internet connection."
  );
}

function createInfoWindow(location) {
  var url_href =
    '<a href="' +
    location.url +
    '"><i class="fa fa-home"></i> ' +
    location.url +
    "</a><br />";
  var url_html =
    location.url !== undefined
      ? url_href
      : '<i class="fa fa-home"></i> No website found.<br />';

  var phone_href =
    '<a href="tel:' +
    location.phone +
    '"><i class="fa fa-phone"></i>' +
    location.phone +
    "</a><br />";
  var phone_html =
    location.phone !== undefined
      ? phone_href
      : '<i class="fa fa-phone"></i> No phone number(s) found.<br />';

  return (
    '<div id="info-window-content">' +
    '<h3 id="firstHeading" class="firstHeading">' +
    location.name +
    "</h3>" +
    '<i class="fa fa-location-arrow"></i> ' +
    location.address() +
    "<br />" +
    phone_html +
    url_html +
    "</div>"
  );
}

function changeMap() {
  if (map === null) return;

  var bounds = new google.maps.LatLngBounds();
  viewModel.locations().forEach(function(location) {
    location.marker.setVisible(location.visibleMarker());
    bounds.extend(location.marker.position);
  });
  map.fitBounds(bounds);
}

$(document).ready(function() {
  // run test on initial page load
  checkSize();

  // run test on resize of the window
  $(window).resize(checkSize);
});

//Function to the css rule
function checkSize() {
  if ($("nav").css("display") === "none") {
    $(".main-container").removeClass("sidebar_shown");
    $(".sidebar").removeClass("sidebar_shown");
  }
}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1400);
  }
}

/*
 * @description The Starting Point
 */
function startApp() {
  viewModel = new viewModel();
  ko.applyBindings(viewModel);

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });

  infoWindow = new google.maps.InfoWindow();
  viewModel.getLocations(FSQ_URL);

  viewModel.filterLocations.subscribe(function() {
    changeMap();
  });
}
