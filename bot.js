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

//using Rune to create images
let fs = require('fs');
var Rune = require('rune.js');
var VNode = require('virtual-dom/vnode/vnode');
var toHTML = require('vdom-to-html');
const svg2png = require("svg2png");
var DrawBox = require('./designs/box');

var r = new Rune({
    width: 600, 
    height: 400
});

//Start a stream to get tweets
var stream = T.stream('user');
stream.on('tweet', onTweet);

var globalTweetParams = {};
var botSN = 'soundvisionchem';

//catch tweets that the bot is tagged in
function onTweet(tweet) {
    logger.debug("Got a tweet: " + JSON.stringify(tweet));
    if(tweet.in_reply_to_screen_name.toLowerCase() == botSN) {
        globalTweetParams.replySN = tweet.user.screen_name;
        logger.debug("Reply to: " + globalTweetParams.replySN);
        globalTweetParams.replyTweetId = tweet.id;
        logger.debug("Reply to tweet id: " + globalTweetParams.replyTweetId);
        logger.debug("In reply to screen name: " + tweet.in_reply_to_screen_name);
    
        logger.debug("We were tagged in the tweet! Creating image...");
        //Create image
        DrawBox.draw(r);
        
        var convertedSVG = toHTML(r.tree);
        svg2png(new Buffer(convertedSVG), {width: 640, height: 480})
        .then(onPNGConversion).catch(e => console.log(e));
    }
}

function onPNGConversion(buffer) {
    var pngToPost = buffer.toString('base64');
    var mediaUploadParams = {
       media_data: pngToPost
    };
        
    T.post('media/upload', mediaUploadParams, onUploadResponse)
}

//after the file upload, post the tweet
function onUploadResponse(error, data, response) {
    if (!error) {
        logger.debug("Tweeting the image...");
        var mediaIdStr = data.media_id_string;
        logger.debug("media is: " + mediaIdStr);
        var params = {
                status: '@' + globalTweetParams.replySN + ': Thanks for the mention! ',
                in_reply_to_status_id: globalTweetParams.replyTweetId,
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