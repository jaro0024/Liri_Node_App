
// 
require("dotenv").config();

// Global Variables
// To include the file keys.js which inlcudes the tokens and API keys
var liriKeys = require("./keys.js");
// Includes the request npm package
var request = require("request");
// Stores all of the arguments in an array
var nodeArgs = process.argv;
// Loads the fs package to read and write
var fs = require("fs");

// LIRI Bot action (i.e. "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says")
var liriBotAction = process.argv[2];

// Switch-case statement to direct which function to run
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

// If movieThis function is called...
function movieThis() {
    // Creates an empty variable for holding the movie name
    var movieName = "";
    // Variable to store OMDB API key
    var movieAPI = "7fc81b28";

    // if (movieName === "") {
    //     movieName = "Mr. Nobody";
    //     console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    //     console.log("It's on Netflix!");
    // }

    // Loops through all the words in the node argument
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];

        } else {
            movieName += nodeArgs[i];
        }
    }

    // Variable to store the API URl and key 
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieAPI;
    // Then run a request to the OMDB API with the movie specified
    request(movieQueryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover the movie details
            var movieDetails = JSON.parse(body);
            // To log the information required for the assignment
            console.log("* Title of the movie: " + movieDetails.Title);
            console.log("* Release Year: " + movieDetails.Year);
            console.log("* IMDB Rating: " + movieDetails.imdbRating);
            // Variable to set and hold movie ratings
            var movieRating = movieDetails.Ratings;
            // If ratings is not blank...
            if (movieRating != "") {
                // For loop to get and log the Rotten Tomatoes ratings
                for (var i = 0; i < movieRating.length; i++) {
                    if (movieRating[i].Source === "Rotten Tomatoes") {
                        console.log("* Rotten Tomatoes Rating: " + movieRating[i].Value);
                    }
                }
                // If it is blank, it logs a message saying that is no rating available 
            } else {
                console.log("* Rotten Tomatoes Rating: Rating information is not available");
            }
            // To log the information required for the assignment
            console.log("* Country where the movie was produced: " + movieDetails.Country);
            console.log("* Language of the movie: " + movieDetails.Language);
            console.log("* Plot of the movie: " + movieDetails.Plot);
            console.log("* Actors in the movie: " + movieDetails.Actors);
        }
    });
}

// If spotifyThisSong function is called...
function spotifyThisSong() {
    // To include the spotify-api
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(liriKeys.spotify);
    // Creates an empty variable for holding the song name
    var songName = "";

    // if (songName === "") {
    //     songName = "The sign Ace of Base";
    // }

    // For loop to capture all the words entered by user
    for (i = 3; i < nodeArgs.length; i++) {
        songName = songName + " " + nodeArgs[i];
    }
    // To search for the song name entered by user
    spotify.search({ type: 'track', query: songName, limit: 1 }, function (error, data) {
        if (!error) {
            // For loop to go through all the data items
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                // To log all the information required for the assignment
                console.log("* Artist: " + songData.artists[0].name);
                console.log("* Song: " + songData.name);
                console.log("* Preview URL: " + songData.preview_url);
                console.log("* Album: " + songData.album.name);
                console.log("-----------------------");
            }
        }
        else {
            // To log an error message if error occurs
            console.log("Error occurred" + error);
        }
    });
}

// If the myTweets function is called...
function myTweets() {
    // To include the Twitter API
    var Twitter = require('twitter');
    var client = new Twitter(liriKeys.twitter);
    // Parameters to pull info from Twitter API
    var params = { screen_name: 'DaniJaros24' };
    // Pulling info from Twitter
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // For loop to get each tweet and the date it was created
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                // To log the top 20 tweets and the dates they were created
                console.log("@DaniJaros24: " + tweets[i].text + " ---" + " Created At: " + date.substring(0, 19));
                console.log("-----------------------");
            }
        }
        else {
            // To log an error message if error occurs
            console.log("Error occurred" + error);
        }
    });
}

// If the doWhatItSays function is called...
// function doWhatItSays() {

//     fs.readFile("random.txt", "utf8", function (error, data) {
//         if (!error) {
//             var txt = data.split(",");

//             spotifyThisSong(txt[1]);

//         } else {
//             console.log("Error occurred" + error);
//         }
//     });
// }