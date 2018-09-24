/**
 * limit the number of comment words
 * @param area
 */
function check(area){
    var maxChars = 1000;
    var text = "You still can input " +(maxChars-area.value.length)+" characters here";
    var obj = document.getElementById("remainder");
    obj.innerHTML = text;
}

/**
 * submit the user comments and save the image which is upload by the user as a string
 */
function submitComment(){
    var socket = io.connect('http://localhost');
    var text = document.getElementById("comment").value;
    var rating = document.getElementById("review-rating").value;
    var imageBlob = document.getElementById('show_image').toDataURL();

    if(text.length<=9){
        alert("Please submit your comment with at least 10 characters");
        return;
    }
    if(rating == '0'){
        alert("Please select a rating");
        return;
    }
    var myDate = new Date();
    var myArray = Array();
    myArray[0] = myDate.getFullYear();
    myArray[1] = myDate.getMonth();
    myArray[2] = myDate.getDate();
    var date = myArray[0]+"-"+myArray[1]+"-"+myArray[2];

    var newphoto = document.createElement("div");
    newphoto.innerHTML ='<img class="preview" src="' + imageBlob + '" alt="preview"/>';

    //if the user doesn't login then the username will be unknown visitor
    var username = getCookie('username');
    if (username == null){
        username = 'unknown visitor'
    }
    var dataUrl = window.location.href;
    var a = dataUrl.split('?');
    var urlData = a[1];
    var id = urlData.split('=')[1];
    // save comments attributes such as username. comment, data, rating score, image
    // and restaurant id for searching and dispaly
    var data = {"username":username,"comment":text,"date":date,"rating":rating,"image":imageBlob,"restaurantid":id};
    socket.emit('comment', data);
    alert("Thank you for your comment!");
    //using socket.io
    socket.on('msg',function (data) {

        if (data == 'success'){
            initReviews();
            document.getElementById("comment").value =null;
            document.getElementById("review-rating").value = '0';
            showRatingSelector();
            var canvas = document.getElementById("show_image");
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,canvas.width,canvas.height);
            canvas.width = 1;
            canvas.height = 1;
        }
    });

}