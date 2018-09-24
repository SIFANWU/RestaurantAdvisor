/**
 *  show rating wirh min size on the index page.
 * @param id
 * @param rating
 */
function showMinRating(id,rating) {
    $('#'+id).raty({
        readOnly: true,
        score: rating,
        hints : ['bad', 'regular', 'good', 'great', 'wonderful'],
        starHalf : '/images/star-half-min.png',
        starOff  : '/images/star-off-min.png',
        starOn   : '/images/star-on-min.png',
        size   : 10
    });
}

/**
 * show rating score on restaurant page with normal size
 * @param id
 * @param rating
 */
function showRating(id,rating) {
    $('#'+id).raty({
        readOnly: true,
        score: rating,
        hints : ['bad', 'regular', 'good', 'great', 'wonderful'],
        starHalf : '/images/star-half.png',
        starOff  : '/images/star-off.png',
        starOn   : '/images/star-on.png',
        size   : 10
    });
}

/**
 * for users to give the rating score by clicking the star button
 */
function showRatingSelector() {
    $('#stars').raty({
        number: 5,
        starOff: '/images/star-off.png',
        starOn: '/images/star-on.png',
        hints: ['bad', 'regular', 'good', 'great', 'wonderful'],
        click: function (score, evt) {
            document.getElementById("review-rating").value = score;
        }
    });
}