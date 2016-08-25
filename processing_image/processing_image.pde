void setup() {
 size(600,400);
 
 float middleWidth = width/2;
 float middleHeight = height/2;
 float rectWidth = width/4;
 float rectHeight = height/4;
 float xLoc = middleWidth - rectWidth/2;
 float yLoc = middleHeight - rectHeight/2;
 float opacity = 255;
 
 background(255, 255, 255);
 color rectColor = color(random(255), random(255), random(255), opacity);
 fill(rectColor);
 noStroke();
 rect(xLoc, yLoc, rectWidth, rectHeight);
 
 save("output.png");
 exit();
}