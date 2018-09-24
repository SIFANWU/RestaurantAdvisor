/**
 * initialize the restaurant page and get attributes value from the database by id
 */
function initPage() {
    //get restaurant id
    var data = {};
    var dataUrl = window.location.href;
    if (dataUrl.indexOf('?')<0){
        alert('error');
        return;
    }
    var a = dataUrl.split('?');
    var urlData = a[1];
    var id = urlData.split('=')[1];
    data['id'] = id;

    //get restaurant by id
    $.ajax({
        url: '/getRestaurant' ,
        data: data,
        dataType: 'json',
        type: 'POST',

        success: function (dataR) {
            var name = document.getElementById('name');
            name.innerText = dataR['name'];

            var description = document.getElementById('description');
            description.innerText = dataR['description'];

            var address = document.getElementById('address');
            address.innerText = dataR['address'];

            var borough = document.getElementById('borough');
            borough.innerText = dataR['borough'];

            var postcode = document.getElementById('postcode');
            postcode.innerText = dataR['postcode'];

            var phone = document.getElementById('phone');
            phone.innerText = dataR['phone'];

            var features = document.getElementById('features');
            features.innerText = dataR['features'];

            var openhours = document.getElementById('openhours');
            openhours.innerText = dataR['openhours'];

            var image = document.getElementById('image');
            image.src=dataR['image'];


            var cuisine = document.getElementById('cuisine');
            cuisine.innerText = dataR['cuisine'];

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {

                    var latlng1 = new google.maps.LatLng(dataR['latitude'], dataR['longitude']);

                    var googleMap = new google.maps.Map(document.getElementById('res-map'), {
                        zoom: 14,
                        center: latlng1
                    });

                    var marker1 = new google.maps.Marker({
                        position: latlng1,
                        map: googleMap,
                        title: dataR['name'],
                        icon: 'images/res-icon.png'
                    });

                    var coords = position.coords;
                    var latlng2 = new google.maps.LatLng(coords.latitude, coords.longitude);


                    var marker2 = new google.maps.Marker({
                        position: latlng2,
                        map: googleMap,
                        title: 'current location'
                    });
                });
            }


        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * get restaurant reviews by restaurant id which is stored in review collection as well
*/
function initReviews() {
    //get restaurant id
    var data = {};
    var dataUrl = window.location.href;
    if (dataUrl.indexOf('?')<0){
        alert('error');
        return;
    }
    var a = dataUrl.split('?');
    var urlData = a[1];
    var id = urlData.split('=')[1];
    data['id'] = id;
    $.ajax({
        url: '/getReviews' ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {

            var all_reviews_container = document.getElementById('review-container');
            while (all_reviews_container.hasChildNodes()){
                all_reviews_container.removeChild(all_reviews_container.firstChild);
            }

            var total_rating = 0;

            for (var i = dataR.length-1; i>=0; i--){

                var review_container = document.createElement('ul');
                review_container.className = 'w3-ul w3-border-bottom w3-margin-bottom';

                var user_element = document.createElement('li');
                user_element.className = 'w3-border-0 ';
                user_element.style='font-weight:bold';
                user_element.innerText = dataR[i]['username'];

                var rating_element = document.createElement('li');
                rating_element.className = 'w3-border-0';
                var id = 'rating'+i;
                rating_element.id = id;

                var date_element = document.createElement('li');
                date_element.className = 'w3-border-0';
                date_element.style='color:grey';
                date_element.innerText = dataR[i]['date'];

                var review_element = document.createElement('li');
                review_element.className = 'w3-border-0';
                review_element.innerText = dataR[i]['review'];

                var image_element = document.createElement('li');
                image_element.innerHTML ='<img style="max-height: 150px" src="' + dataR[i]['image'] + '" alt="preview"/>';

                review_container.appendChild(user_element);
                review_container.appendChild(rating_element);
                review_container.appendChild(date_element);
                review_container.appendChild(review_element);
                review_container.appendChild(image_element);

                all_reviews_container.appendChild(review_container);
                showMinRating(id,dataR[i]['rating']);
                total_rating += parseFloat(dataR[i]['rating']);
            }

            var averaged = total_rating/dataR.length;
            var length = dataR.length;
            var data2 = {};
            data2['name'] = document.getElementById('name').innerText;
            data2['rating'] = averaged;
            $.ajax({
                url: '/update-rating',
                data: data2,
                dataType: 'json',
                type: 'POST',
                success: function (dataR) {
                    showRating('rating',averaged);
                    document.getElementById('reviewed-people').innerText = " "+length;
                },
                error: function (xhr, status, error) {
                    alert('Error: ' + error.message);
                }
            });

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}
