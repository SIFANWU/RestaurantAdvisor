/**
 *  set cookie
 * @param key
 * @returns {string} key_value
 */
function getCookie (key) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i<cookies.length; i++){
        var cookie = cookies[i].trim();
        var key_value = cookie.split('=');
        if (key_value[0] == key){
            return key_value[1];
        }
    }
}

/**
 * clear cookie
 */
function clearCookie()  {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

/**
 *
 * @param key  "username"
 * @param value  aaa \\ bbb \\ cccc
 * @param exdays
 */
function setCookie(key, value,exdays) {
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = key + "=" + value + "; " + expires;
};