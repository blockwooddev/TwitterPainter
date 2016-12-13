var Rune = require('rune.js');

var BoxFill = {        
     drawBox: function (rune, originx, originy, width, height) {
         if(height < 20 || width < 20) {
             return;
         }
         
         var color1  = new Rune.Color(Rune.random(0,255), Rune.random(0,255), Rune.random(0,255));
         var color2  = new Rune.Color(Rune.random(0,255), Rune.random(0,255), Rune.random(0,255));
         var coin_flip = Rune.random(0,2);
         if(coin_flip < 1){
             var top_height = Rune.random(1, height);
             var bottom_height = height - top_height;
             rune.rect(originx, originy, width, top_height).stroke(true).fill(color1);
             rune.rect(originx, originy+top_height, width, bottom_height).stroke(true).fill(color2);
             this.drawBox(rune, originx, originy, width, top_height);
             this.drawBox(rune, originx, originy+top_height, width, bottom_height)
         } else if(coin_flip > 1){
             var right_width = Rune.random(1, width);
             var left_width = width - right_width;
             rune.rect(originx, originy, left_width, height).stroke(true).fill(color1);
             rune.rect(originx+left_width, originy, right_width, height).stroke(true).fill(color2);
             this.drawBox(rune, originx, originy, left_width, height);
             this.drawBox(rune, originx+left_width, originy, right_width, height)
         }
     },
     create: function(rune) {
         this.drawBox(rune, 0, 0, rune.width, rune.height);
     }
}

module.exports = BoxFill;
