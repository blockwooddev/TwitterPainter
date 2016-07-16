//Our Twitter library
var Twit = require('twit');

//We need to include our configuration file
var T = new Twit(require('./config.js'));

//Find the latest tweet in which bot is mentioned
function getMentions() {
    var mentions = {count: 10}; 
    T.get('statuses/mentions_timeline', mentions, hashtagFromMentions);
}

//grabs hashtags from JSON and chooses the first one to retweet
function hashtagFromMentions(error, data) {
    // log out any errors and responses
    console.log(error, data);
    // If our search request to the server had no errors...
    if (!error) {
        // ...then we grab the ID of the tweet we want to retweet...
        console.log(data);

        var firstStatus = data[0];
        var retweetId = firstStatus.id_str;
        var hashtags = firstStatus.entities.hashtags[0].text;
        console.log("Making hashtags");
        if(hashtags != null) {
            //retweet the hashtag we found.
            retweetHashtag(hashtags)
        } else {
            console.log("Null result")
        }
    }
    else {
        console.log('There was an error with your hashtag search:', error);
    }
}

//This function retweets the first result it finds with the hashtag passed to it 
//as an argument.
function retweetHashtag(hashtag) {
    var mediaArtSearch = {q: '#' + hashtag, count:1};
    console.log("Searching for: " + mediaArtSearch.q);
    T.get('search/tweets', mediaArtSearch, function (error, data) {
        console.log(error, data);
        // If our search request to the server had no errors...
        if (!error) {
            // ...then we grab the ID of the tweet we want to retweet...
            console.log(data);
            if(data.statuses.length > 0) {
                var firstStatus = data.statuses[0];
                var retweetId = firstStatus.id_str;
                console.log("About to retweet statuses");
                // ...and then we tell Twitter we want to retweet it!
                T.post('statuses/retweet/' + retweetId, { }, handleRetweetResponse);
            }
            else {
                console.log("Did not find any statuses");
            }
        }

        // However, if our original search request had an error, we want to print it out here.
        else {
            console.log('There was an error with your hashtag search:', error);
        }
    });
}

//handle response from retweet request
function handleRetweetResponse(error, response) {
    if (response) {
        console.log('Success! Check your bot, it should have retweeted something.')
    }
    // If there was an error with our Twitter call, we print it out here.
    if (error) {
        console.log('There was an error with Twitter:', error);
    }
}

//This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
    getMentions();
}

//Try to retweet something as soon as we run the program...
retweetLatest();
//...and then every hour after that. Time here is in milliseconds, so
//1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
