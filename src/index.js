/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');




//executing code

//loading info
$("#info").append(`<div class="lds-css ng-scope"><div style="width:100%;height:100%" class="lds-double-ring mx-auto"><div></div><div></div></div><style type="text/css">@keyframes lds-double-ring {
0% {
-webkit-transform: rotate(0);
transform: rotate(0);
}
100% {
-webkit-transform: rotate(360deg);
transform: rotate(360deg);
}
}
@-webkit-keyframes lds-double-ring {
    0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
}
    100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
}
}
@keyframes lds-double-ring_reverse {
    0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
}
    100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
}
}
@-webkit-keyframes lds-double-ring_reverse {
    0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
}
    100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
}
}
.lds-double-ring {
    position: relative;
}
.lds-double-ring div {
    position: absolute;
    width: 120px;
    height: 120px;
    top: 40px;
    left: 40px;
    border-radius: 50%;
    border: 8px solid #000;
    border-color: #8a8a8a transparent #8a8a8a transparent;
    -webkit-animation: lds-double-ring 1s linear infinite;
    animation: lds-double-ring 1s linear infinite;
}
.lds-double-ring div:nth-child(2) {
    width: 100px;
    height: 100px;
    top: 50px;
    left: 50px;
    border-color: transparent #ffe72b transparent #ffe72b;
    -webkit-animation: lds-double-ring_reverse 1s linear infinite;
    animation: lds-double-ring_reverse 1s linear infinite;
}
.lds-double-ring {
    width: 200px !important;
    height: 200px !important;
    -webkit-transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
    transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
}
</style></div>`);





//render info
$.ajax("/api/movies").done(function(data) {
    $("#info").html("");

    data.forEach(function(movie) {
        $("#info").append(formatMovie(movie));
    });

    //adds event listener to edit button after created
    $(".edit").click(function(e) {
            e.preventDefault();
            //console.log(e.target.id.charAt(5));
            let id = e.target.id.charAt(5);
            getMovie(id);
    });

    //adds event listener to delete button after created
    $(".delete").click(function(e) {
        e.preventDefault();
        let id = e.target.id.charAt(7);
        removeMovie(id);
    });


});

//test
//removeMovie(1);



//button event listeners

//add movie button click
$("#add-submit").click(function(e) {

    //prevents button from refreshing page
    e.preventDefault();

    //disables button when clicked
    $(this).prop("disabled",true);

    addMovie($("#movie-title").val(), $('input[name=movie-rating]:checked').val());
    $("#movie-title").val("");
    $('input[name=movie-rating]:checked').prop('checked', false);
});

//edit movie button click
$("#edit-submit").click(function(e) {

    //prevents button from refreshing page
    e.preventDefault();

    //disables button when clicked
    $(this).prop("disabled",true);

    //updates movie request
    updateMovie($("#edit-id").val());

    //refreshes input on page
    $("#edit-title").val("");
    $('input[name=edit-rating]:checked').prop('checked', false);
    // addMovie($("#movie-title").val(), $('input[name=movie-rating]:checked').val());
});





//functions

function formatMovie(movie) {
    let movieString = `<span class="movie row d-flex justify-content-between"><p class="title text-left" style="width: 350px">${movie.title}</p>`;
    movieString += `<p class="rating" style="width: 60px">${movie.rating}</p>`;
    movieString += `<p><button id=edit-${movie.id} class="btn edit">Edit</button> <button id=delete-${movie.id} class="btn delete">Remove</button></p></span>`;
    return movieString;
}

function renderMovies() {
    //reloads movies
    $.ajax("/api/movies").done(function(data) {
        //clears data displayed
        $("#info").html("");

        //appends info
        data.forEach(function(movie) {
            $("#info").append(formatMovie(movie));
        });

        //adds event listener to edit button after created
        $(".edit").click(function(e) {
            e.preventDefault();
            //charAt(5) will be only movie id removed from button id (ex. edit-2)
            let id = e.target.id.charAt(5);
            getMovie(id);
        });

        //adds event listener to delete button after created
        $(".delete").click(function(e) {
            e.preventDefault();
            let id = e.target.id.charAt(7);
            removeMovie(id);
        });

    });

}

function addMovie(title, rating) {
    let addMovie = $.ajax("/api/movies", {
        type: "POST",
        dataType: "json",
        data: {
            title: title,
            rating: rating
        }
    });


    addMovie.done( () => $("#add-submit").removeAttr("disabled"));

    //renders movies with changes
    renderMovies();
}

function getMovie(id) {
    let getMovie = $.ajax(`/api/movies/${id}`, {
        type: "GET",
        dataType: "json"
    });

    getMovie.done(movie => {
        $("#edit-title").val(movie.title);
        $("[name=edit-rating]").val([movie.rating.toString()]);

        $("#edit-id").val(id);
        console.log($("#edit-id").val());


        //other way to edit
        // $(`#edit-${movie.rating}`).prop('checked', true);

    });
}

function updateMovie(id) {
    console.log("update movie running");

    let updateMovie = $.ajax(`/api/movies/${id}`, {
        type: "PUT",
        dataType: "json",
        data: {
            title: $("#edit-title").val(),
            rating: $('input[name=edit-rating]:checked').val()
        }
    });

    updateMovie.done( () => $("#edit-submit").removeAttr("disabled"));
    renderMovies();
}


function removeMovie(id) {
    $.ajax(`/api/movies/${id}`, {
        type: "DELETE",

    });

    //reloads movies
   renderMovies();
}



