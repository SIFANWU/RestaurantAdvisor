/**
 *  Add a restaurant from the user input form
 */
function addRestaurant() {
    var data = {};
    data.name= document.getElementById("name").value;
    data.address= document.getElementById("address").value;
    data.description=document.getElementById("description").value;
    data.postcode=document.getElementById("postcode").value;
    data.borough=document.getElementById("borough").value;
    data.cuisine=document.getElementById("cuisine").value;
    data.phone=document.getElementById('phone').value;
    data.features= document.getElementById("features").value;
    data.openhours= document.getElementById("openhours").value;
    data.image=document.getElementById('show_image').toDataURL();
    data.longitude = document.getElementById('longitude').value;
    data.latitude = document.getElementById('latitude').value;
    data.rating = 0;


    $.ajax({
        url: '/addNewRestaurant' ,
        data: data,
        dataType: 'json',
        type: 'POST',

        success: function (dataR) {
            var result= dataR["result"];
            if (result=='success') {
                alert("Add a new restaurant successfully!");
                var current_url = window.location.href;
                var new_url = current_url.replace('/addrestaurant','');
                window.location.href = new_url;
            }else {
                alert(result);
            }

        },
        error: function (xhr, status, error) {
            alert('Error11: ' + error.message);
        }
    });

}

/**
 *  initialize the map and add marker with event listener
 */
function initMap() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var coords = position.coords;
            document.getElementById('latitude').value = coords.latitude;
            document.getElementById('longitude').value = coords.longitude;
            var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);

            var googleMap = new google.maps.Map(document.getElementById('add-res-map'), {
                zoom: 14,
                center: latlng
            });

            var marker = new google.maps.Marker({
                position: latlng,
                map: googleMap
            });

            google.maps.event.addListener(googleMap,'click',function (event) {
                marker.setPosition(event.latLng);
                document.getElementById('latitude').value = event.latLng.lat();
                document.getElementById('longitude').value = event.latLng.lng();
            })
        });
    }
}