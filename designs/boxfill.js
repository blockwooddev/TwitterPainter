var Rune = require('rune.js');

var BoxFill = {        
     drawBox: function (rune, originx, originy, width, height, initial_count=1) {
         console.log("Height: ", height, "Width: ", width, "X: ", originx, "Y: ", originy);
         if(height < 1 || width < 1) {
             console.log("Never gonna happen");
             return;
         }
         
         var color1  = new Rune.Color(Rune.random(0,255), Rune.random(0,255), Rune.random(0,255));
         var color2  = new Rune.Color(Rune.random(0,255), Rune.random(0,255), Rune.random(0,255));

         var coin_flip = Rune.random(0,2);
         
         var top_height, bottom_height, left_width, right_width;
         var draw_width = false;
         var draw_height = false;
         //first_time keeps it from doing a simple two-box pattern
         
         if(height == width) {
             if(coin_flip < 1) {
                 coin_flip = Rune.random(0, 2);
                 if(coin_flip < 1) {
                     bottom_height = Rune.random(1, height);
                     top_height = height - bottom_height;
                 } else {
                     top_height = Rune.random(1, height);
                     bottom_height = height - top_height;
                 }
                 draw_height = true;
             } else {
                 coin_flip = Rune.random(0, 2);
                 if(coin_flip < 1) {
                     right_width = Rune.random(1, width);
                     left_width = width - right_width;
                 } else {
                     left_width = Rune.random(1, width);
                     right_width = width - left_width;
                 }
                 draw_width = true;
             }
             
         } else if (height > width) {
             if(coin_flip < 1) {
                 bottom_height = height - width;
                 top_height = width;
             } else {
                 bottom_height = width;
                 top_height = height - width;
             }
             draw_height = true;
         } else if(width > height){
             if(coin_flip < 1) {
                 right_width = width - height;
                 left_width = height;
             } else {
                 right_width = height;
                 left_width = width - height;
             }
             draw_width = true;
         }
         
         
         if(draw_height){
             
             if(top_height <= 1 || bottom_height <= 1){
                 console.log("The end");
             }
             
             coin_flip = Rune.random(0, 2);
             if(coin_flip < 1 && initial_count < 0) {
                 rune.rect(originx, originy, width, top_height).stroke(true).fill(color1);
             } else {
                 this.drawBox(rune, originx, originy, width, top_height, --initial_count);
             }
             
             coin_flip = Rune.random(0, 2);
             if(coin_flip < 1 && initial_count < 0) {
                 rune.rect(originx, originy+top_height, width, bottom_height).stroke(true).fill(color2);
             } else {
                 this.drawBox(rune, originx, originy+top_height, width, bottom_height, --initial_count);
             }
         } else if(draw_width){
             
             if(right_width <= 1 || left_width <= 1){
                 console.log("The end");
             }
             
             coin_flip = Rune.random(0, 2);
             if(coin_flip < 1 && initial_count < 0) {
                 rune.rect(originx, originy, left_width, height).stroke(true).fill(color1);
             } else {
                 this.drawBox(rune, originx, originy, left_width, height, --initial_count);
             }
             coin_flip = Rune.random(0, 2);
             if(coin_flip < 1 && initial_count < 0) {
                 rune.rect(originx+left_width, originy, right_width, height).stroke(true).fill(color2);
             } else {
                 this.drawBox(rune, originx+left_width, originy, right_width, height, --initial_count);
             }
         }
     },
     create: function(rune) {
         this.drawBox(rune, 0, 0, rune.width, rune.height);
     }
}

module.exports = BoxFill;
