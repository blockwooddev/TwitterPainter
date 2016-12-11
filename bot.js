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
var botSN = 'tweetanddraw';

var shapes = [];

//catch tweets that the bot is tagged in
function onTweet(tweet) {
    logger.debug("Got a tweet: " + JSON.stringify(tweet));
    if(tweet.in_reply_to_screen_name && tweet.in_reply_to_screen_name.toLowerCase() == botSN) {
        globalTweetParams.replySN = tweet.user.screen_name;
        logger.debug("Reply to: " + globalTweetParams.replySN);
        globalTweetParams.replyTweetId = tweet.id;
        logger.debug("Reply to tweet id: " + globalTweetParams.replyTweetId);
        logger.debug("In reply to screen name: " + tweet.in_reply_to_screen_name);
    
        logger.debug("Grab those hashtags", tweet.entities.hashtags[0]);
        logger.debug("Text: ", tweet.text)
        
        logger.debug("We were tagged in the tweet! Creating image...");
        //Create image
        if(r.stage) {
            var currentChildren = r.stage.children;
            for(child in currentChildren) {
                var childElement = currentChildren[child];
                r.stage.remove(childElement);
            }
        }
        
        processText(tweet.text);
//        DrawBox.draw(r);
        
        var convertedSVG = toHTML(r.tree);
        svg2png(new Buffer(convertedSVG), {width: 600, height: 400})
        .then(onPNGConversion).catch(e => console.log(e));
    }
}

function processText(text) {
    logger.debug("Entered processText with this: " + text);
    var words = text.split(" ");
    
    for(wordInd in words) {
        var word = words[wordInd];
        console.log(word);
        var xLoc = Rune.random(0,600);
        var yLoc = Rune.random(0,400);
        var color  = new Rune.Color(Rune.random(0,255), Rune.random(0,255), Rune.random(0,255));
        
        switch(word) {
            case 'rect':
                var width = Rune.random(10,200);
                var height = Rune.random(10,100);
                r.rect(xLoc, yLoc, width, height).stroke(false).fill(color);
                break;
            case 'circle':
                var radius = Rune.random(5,100);
                r.circle(xLoc, yLoc, radius).stroke(false).fill(color);
                break;
            case 'square':
                var side = Rune.random(10,200);
                r.rect(xLoc, yLoc, side, side).stroke(false).fill(color);
                break;
            case 'triangle':
                var x2 = Rune.random(0, 600);
                var y2 = Rune.random(0, 400);
                while(x2 == xLoc && y2 == yLoc) {
                    x2 = Rune.random(0, 600);
                    y2 = Rune.random(0, 400);
                }
                var x3 = Rune.random(0, 600);
                var y3 = Rune.random(0, 400);
                while((x3 == xLoc && y3 == yLoc) || (x3 == x2 && y3 == y2)) {
                    x3 = Rune.random(0, 600);
                    y3 = Rune.random(0, 400);
                }
           
                r.triangle(xLoc, yLoc, x2, y2, x3, y3).stroke(false).fill(color);
                break;
            default:
                logger.debug("Couldn't recognize that word:" + word);
        }
    }
    r.draw();
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