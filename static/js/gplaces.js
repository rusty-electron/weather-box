let searchInput = document.querySelector('.searchbox');

function activateSearch(){
    let autocomplete = new google.maps.places.Autocomplete(searchInput);

    autocomplete.addListener('place_changed', function() {
      let place = autocomplete.getPlace();

      loc = [place.geometry.location.lat(), 
             place.geometry.location.lng()]

      let city = place.address_components[0].long_name
      let country = ''

      if(place.address_components.length > 1)
        country = (place.address_components[1].short_name || place.address_components[3].short_name)

      setLocation(loc, city, country);
      fetchWeather();
    });
}