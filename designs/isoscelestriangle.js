var Rune = require('rune.js');

var IsoscelesTriangle = {
     create: function (rune) {
         var xLoc = Rune.random(0,rune.width);
         var yLoc = Rune.random(0,rune.height);
         var color  = new Rune.Color(Rune.random(0,255), Rune.random(0,255), Rune.random(0,255));
         
         var sidelength = Rune.random(5, rune.width/2);
         var trianglepeak = Rune.radians(Rune.random(2, 178));
         var trianglerot = Rune.radians(Rune.random(0, 360));
         
         
         var x2 = sidelength*Math.cos(trianglerot) + xLoc;
         var y2 = sidelength*Math.sin(trianglerot) + yLoc;
         
         var x3 = sidelength*Math.cos(trianglerot + trianglepeak) + xLoc;
         var y3 = sidelength*Math.sin(trianglerot + trianglepeak) + yLoc;
         
         rune.triangle(xLoc, yLoc, x2, y2, x3, y3).stroke(false).fill(color);
     }  
}

module.exports = IsoscelesTriangle;
