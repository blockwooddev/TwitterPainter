//Setting up the logger
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ 
          filename: 'debug.log'
      })
    ]
  });

logger.level = 'debug';

//Setting up the Twitter library
var Twit = require('twit');
var T = new Twit(require('./config.js'));

//child process to run Processing
var exec = require('child_process').exec;
var fs = require('fs');

//Start a stream to get tweets
var stream = T.stream('user');
stream.on('tweet', onTweet);

//catch tweets that the bot is tagged in
function onTweet(tweet) {
    logger.debug("Got a tweet: " + JSON.stringify(tweet));

    logger.debug("In reply to screen name: " + tweet.in_reply_to_screen_name);
    if(tweet.in_reply_to_screen_name == 'soundvisionchem') {
        logger.debug("We were tagged in the tweet! Creating image...");
//        var cmd = "processing-java.exe --sketch=[path-to-project]\\processing_image --run";
        var cmd = "processing-java.exe --sketch=C:\\Users\\Barry\\Documents\\Programming\\Personal\\TwitterPainter\\processing_image --run";
        exec(cmd, handleProcessingResult);
    }
}
//
//after returning from javascript exec call,
//convert the created image to base64
function handleProcessingResult(err, stdout, stderr) {
    logger.debug(stdout);
    if(!err) {
        logger.debug("Performing a media upload");
        var filename = "processing_image\\output.png";
        var params = {
                encoding: "base64"
        };
        fs.readFile(filename, params, onFileRead);
    } else {
        logger.error(err);
    }
}

//after returning from the file read, 
//send the image to Twitter
function onFileRead(err, data) {
    if (err) {
        logger.error("File Read Error: ")
        logger.error(err);
    } else {
        var pngToPost = data;
        var mediaUploadParams = {
                media_data: pngToPost
        };
        T.post('media/upload', mediaUploadParams, onUploadResponse);
        
        logger.debug("File was read with no errors");
    }
}

//after the file upload, post the tweet
function onUploadResponse(error, data, response) {
    if (!error) {
        logger.debug("Tweeting the image...");
        var mediaIdStr = data.media_id_string;
        logger.debug("media is: " + mediaIdStr);
        var params = {
                status: 'Okey Dokey ',
                media_ids: [mediaIdStr]
        };
        T.post('statuses/update', params, handleTweetResponse);
    } else {
        logger.error("There was an error with the media upload");
        logger.error(error);
    }
}

//handle response from tweet request
function handleTweetResponse(error, data, response) {
    if (response) {
        logger.debug('Success! Check your bot, it should have tweeted an image.')
    }
    // If there was an error with our Twitter call, we print it out here.
    if (error) {
        logger.error('There was an error with Twitter:', error);
    }
}