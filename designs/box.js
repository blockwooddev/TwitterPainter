var Rune = require('rune.js');

var Box = {
     draw: function (rune) {
         var middleWidth = rune.width/2;
         var middleHeight = rune.height/2;
         var rectWidth = rune.width/4;
         var rectHeight = rune.height/4;
         var xLoc = middleWidth - rectWidth/2;
         var yLoc = middleHeight - rectHeight/2;
         var red = Math.floor((Math.random() * 100) + 1);
         var green = Math.floor((Math.random() * 100) + 1);
         var blue = Math.floor((Math.random() * 100) + 1);
         var color = new Rune.Color(red, green, blue);
         
         var shape = rune.rect(xLoc, yLoc, rectWidth, rectHeight).stroke(false).fill(color);
               
         rune.draw();
     }  
}

module.exports = Box;
