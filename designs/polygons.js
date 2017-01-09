var Rune = require('rune.js');

var Polygons = {
     create: function (rune, numPoints=4) {
         var radius = Rune.random(5, rune.width/2);
         var rotation = Rune.random(1, 180);
         var cx = Rune.random(1, rune.width);
         var cy = Rune.random(1, rune.height);
         var color  = new Rune.Color(Rune.random(0,255), Rune.random(0,255), Rune.random(0,255));
         var shape = rune.polygon(cx, cy).stroke(false).fill(color);
//       360/4: 90
         var spacing = 360/numPoints;
         
         
         for(var j = 0; j < numPoints; j++) {
           var x1 = Math.cos(Rune.radians((j * spacing)+rotation)) * radius;
           var y1 = Math.sin(Rune.radians((j * spacing)+rotation)) * radius;
           
           shape.lineTo(x1, y1);
         }
     }    
}

module.exports = Polygons;
