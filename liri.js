
// var util = require('util');

require("dotenv").config();

// VARIABLES:
var liriKeys = require("./keys.js");
// Include the request npm package
var request = require("request");
// Store all of the arguments in an array
var nodeArgs = process.argv;
// Load the fs package to read and write
var fs = require("fs");

// The first will be the LIRI Bot action (i.e. "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says")
var liriBotAction = process.argv[2];

// Switch-case statement and it will direct which function gets run
switch (liriBotAction) {
    case "movie-this":
        movieThis();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "my-tweets":
        myTweets();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
}

// If the "movieInfo" function is called...
function movieThis() {
    // Create an empty variable for holding the movie name
    var movieName = "";
    // OMDB API
    var movieAPI = "7fc81b28";
    // Loop through all the words in the node argument
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];

        } else {
            movieName += nodeArgs[i];
        }
    }

    // Then run a request to the OMDB API with the movie specified
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieAPI;

    request(movieQueryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover the movie details
            var movieDetails = JSON.parse(body);

            console.log("* Title of the movie: " + movieDetails.Title);
            console.log("* Release Year: " + movieDetails.Year);
            console.log("* IMDB Rating: " + movieDetails.imdbRating);

            var movieRating = movieDetails.Ratings;

            if (movieRating != "") {

                for (var i = 0; i < movieRating.length; i++) {

                    if (movieRating[i].Source === "Rotten Tomatoes") {
                        console.log("* Rotten Tomatoes Rating: " + movieRating[i].Value);
                    }
                }

            } else {
                console.log("* Rotten Tomatoes Rating: Rating information is not available");
            }

            console.log("* Country where the movie was produced: " + movieDetails.Country);
            console.log("* Language of the movie: " + movieDetails.Language);
            console.log("* Plot of the movie: " + movieDetails.Plot);
            console.log("* Actors in the movie: " + movieDetails.Actors);
        }
    });
}

function spotifyThisSong() {

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(liriKeys.spotify);

    var songName = "";

    for (i = 3; i < nodeArgs.length; i++) {
        songName = songName + " " + nodeArgs[i];
    }

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (!err) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                //artist
                console.log("* Artist: " + songData.artists[0].name);
                //song name
                console.log("* Song: " + songData.name);
                //spotify preview link
                console.log("* Preview URL: " + songData.preview_url);
                //album name
                console.log("* Album: " + songData.album.name);
                console.log("-----------------------");
            }
        }
        else {
            console.log('Error occurred.');
        }
    });
}

function myTweets() {

    var Twitter = require('twitter');
    var client = new Twitter(liriKeys.twitter);
    console.log(liriKeys.twitter);

    var params = { screen_name: 'DaniJaros24' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@DaniJaros24: " + tweets[i].text + " ---" + " Created At: " + date.substring(0, 19));
                console.log("-----------------------");
            }
        }
        else {
            console.log('Error occurred');
        }
    });
}

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            console.log(doWhatItSaysResults);

        } else {
            console.log("Error occurred" + error);
        }
    });
}