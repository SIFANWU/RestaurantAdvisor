/**
 * check the user whether exist by searching the username and password
 */
function login() {
    var url = "/attempt-login";
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var data = {};
    data['username'] = username;
    data['password'] = password;

    $.ajax({
        url:url,
        data:data,
        dataType:'json',
        type:'POST',
        success: function (dataR) {
            var result = dataR['result'];
            if (result == 'success'){
                alert("Login Successfully!")
                var current_url = window.location.href;
                var new_url = current_url.replace('/login','');
                setCookie('username',username);
                window.location.href = new_url;
            }
            else {
                alert(result)
            }
        },
        error: function (xhr, status, error) {
            console.log(error)
        }
    });
}

/**
 * add a user record in the database after check the uer exist or not
 */
function register() {
    var url = "/attempt-register";
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username+","+password);
    var data = {};
    data['username'] = username;
    data['password'] = password;

    $.ajax({
        url:url,
        data:data,
        dataType:'json',
        type:'POST',
        success: function (dataR) {
            var result = dataR['result'];
            if (result == 'success'){
                alert("Register Successfully!")
                var current_url = window.location.href;
                var new_url = current_url.replace('/register','');
                setCookie('username',username);
                window.location.href = new_url;
            }
            else {
                alert(result);
            }

        },
        error: function (xhr, status, error) {
           console.log(error)
        }
    });
}

