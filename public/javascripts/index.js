var googleMap = null;
var mapMarkers = [];
var latlng = null;
var searchedRestaurants = null;
var isOnline = true;

//Register the service worker to cache page when the client offline
if(navigator.serviceWorker){
    window.addEventListener('DOMContentLoaded', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('service worker register successful');
        }).catch(function (err) {
            console.log('servcie worker register failed')
        });
    });
}

function initConnStatus() {
    //show the status at the first time
    if(window.navigator.onLine) {
        isOnline = true;
        document.getElementById('status').innerText = 'Online';
        document.getElementById('status').style = "color:green";
    }else {
        isOnline = false;
        document.getElementById('status').innerText = 'Offline';
        document.getElementById('status').style = "color:red";
    }

    //Register event listener to update the status.
    window.addEventListener('online',  function(){
        isOnline = true;
        document.getElementById('status').innerText = 'Online';
        document.getElementById('status').style = "color:green";

    });
    window.addEventListener('offline', function(){
        isOnline = false;
        document.getElementById('status').innerText = 'Offline';
        document.getElementById('status').style = "color:red";
    });
}

/**
 * compare two obj rating score
 * @returns {Function}
 */
function compare(){
    return function(obj1,obj2){
        var value1 = obj1['rating'];
        var value2 = obj2['rating'];

        if(value1 > value2){
            return -1;
        }else if(value1 < value2){
            return 1;
        }else{
            return 0;
        }
    }
}

function sortRestaurant() {
    var sortedRestaurants = searchedRestaurants.sort(compare());
    showRestaurants(sortedRestaurants);
}

/**
 * Get detail information and add html element in view page
 * @param restaurants
 */
function showRestaurants(restaurants) {
    var allRes = document.getElementById('resContainer');
    allRes.innerHTML = "";


    for (var i = 0; i<restaurants.length; i++){
        //create html to include image and descriptions
        var restaurant = document.createElement("a");
        restaurant.style = "text-decoration: none";
        restaurant.href = window.location.href +"restaurant?id="+ restaurants[i]['_id'];
        restaurant.className = "w3-col l2 m4 s6 w3-margin-bottom";

        allRes.appendChild(restaurant);

        //crate html to display image
        var image_container = document.createElement("div");
        image_container.style = "position:relative; width:100%; height:0; padding-top:70%";
        var image = document.createElement("img");
        image.src = restaurants[i]['image'];
        image.style = "width: 100%;position:absolute;top:0;left:0;height:100%";
        image_container.appendChild(image);

        //create html to display descriptions
        var description = document.createElement("ul");
        description.className = "w3-ul";

        //append image and descriptions
        restaurant.appendChild(image_container);
        restaurant.appendChild(description);

        //Add Descriptions
        var name = document.createElement("li");
        var a = document.createElement("b");
        a.style = "display:block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;";
        a.innerHTML = restaurants[i]['name'];
        name.appendChild(a);

        var rating = document.createElement("li");
        var rating_bar = document.createElement("div");
        var rating_id = "rating_res"+i;
        rating_bar.id = rating_id;
        rating.appendChild(rating_bar);

        var cuisine = document.createElement("li");
        cuisine.style = "display:block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;"
        cuisine.innerHTML = restaurants[i]['cuisine'];
        var postcode = document.createElement("li");
        postcode.style = "display:block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;"
        postcode.innerHTML = restaurants[i]['postcode'];

        var address =document.createElement("li");
        address.style = "display:block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;"
        address.innerHTML = restaurants[i]['address'];

        description.appendChild(name);
        description.appendChild(rating);
        description.appendChild(cuisine);
        description.appendChild(postcode);
        description.appendChild(address);

        showMinRating(rating_id,restaurants[i]['rating']);
    }
}

/**
 * Search keywords by tag and show this restaurant by last function
 * @param tag
 */
function searchByTag(tag) {
    if(!isOnline){
        alert('Cannot search when offline');
        return;
    }

    var data ={};
    data['keyword'] = tag;
    data['postcode'] = '';
    data['cuisine'] = '';
    $.ajax({
        url: '/getSearchedRestaurant',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            searchedRestaurants = dataR;
            showRestaurants(searchedRestaurants);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * Search restaurants by the keywords the user input.
 * display the restaurant by the showRestaurant().
 */
function searchRestaurant() {
    if(!isOnline){
        alert('Cannot search when offline');
        return;
    }
    var keyword = document.getElementById('keyword').value;
    var postcode = document.getElementById('postcode').value;
    var cuisine = document.getElementById('cuisine').value;
    var data = {};
    data['keyword'] = keyword;
    data['postcode'] = postcode;
    data['cuisine'] = cuisine;

    $.ajax({
        url: '/getSearchedRestaurant',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            searchedRestaurants = dataR;
            showRestaurants(searchedRestaurants);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * initialize the google map and locate the current location and mark it
 */
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var coords = position.coords;
            latlng = new google.maps.LatLng(coords.latitude, coords.longitude);

            googleMap = new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center: latlng,
                mapTypeId: 'roadmap'
            });

            var marker = new google.maps.Marker({
                position: latlng,
                map: googleMap
            });
        });

    }else {
        alert('error');
    }
}

/**
 *show restaurants and add event listeners for each map marker
 * the user can enter the restaurant page by clicking the marker icon
 */
function showAroundRestaurant() {
    if(!isOnline){
        alert('Cannot search when offline');
        return;
    }

    var distance = document.getElementById('search-range').value;
    if (distance<0 || distance>10){
        alert('Invalid Range');
        return;
    }

    var data = {};
    data['latitude'] = latlng.lat();
    data['longitude'] = latlng.lng();
    data['max-distance'] = distance * 1000;
    $.ajax({
        url: '/getAroundRestaurant' ,
        data: data,
        dataType: 'json',
        type: 'post',
        success: function (dataR) {
            for (var i = 0; i<mapMarkers.length;i++){
                mapMarkers[i].setPosition(null);
                mapMarkers[i].setMap(null);
            }

            mapMarkers = [];

            for (var i = 0; i<dataR.length;i++){
                var latlng2 = new google.maps.LatLng(parseFloat(dataR[i]['latitude']), parseFloat(dataR[i]['longitude']));
                mapMarkers.push(new google.maps.Marker({
                    position: latlng2,
                    map: googleMap,
                    icon: 'images/res-icon.png',
                }));
                var new_url = window.location.href +"restaurant?id="+ dataR[i]['_id'];
                mapMarkers[i].addListener('click',redirect(new_url));

            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function redirect(url) {
    var new_url = url;
    return function (event) {
        window.location.href = new_url;
    }
}


