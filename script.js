var canvas, c, container, screen_width, screen_height, mouseX, mouseY, mouseDown, counter_1, counter_2;
var keyDown = [];
var view = [];

function app(canvas, width, height, fullscreen){
  if(fullscreen){
    document.body.style.margin = 0;
    width = window.innerWidth;
    height = window.innerHeight;
  }
  canvas = document.getElementById(canvas);
  c = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width;
  canvas.style.height = height;
  screen_width = width;
  screen_height = height;
  container = canvas.getBoundingClientRect();
}

// 2d functions
function rect(x, y, w, h) {
    c.beginPath();
    c.rect(x, y, w, h);
}
function circle(x, y, r) {
    c.beginPath();
    c.arc(x, y, r, 0, 2 * Math.PI);
}
function tri(x1, y1, x2, y2, x3, y3){
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.lineTo(x3, y3);
  c.lineTo(x1, y1);
}
function fill(color) {
    c.fillStyle = color;
    c.fill();
}
function stroke(color, t) {
    c.strokeStyle = color;
    c.lineWidth = t;
    c.stroke();
}
function rotate(x, y, a) {
    c.save();
    c.translate(x, y);
    c.rotate(a * Math.PI / 180);
}
function restore(){
  c.restore();
}
function collides(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2) {
        return true;
    }
    return false;
}
function getAngle(x1, y1, x2, y2, angle){
  if(angle){
    return Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI + 90;
  }
  else{
    return Math.atan2(y1 - y2, x1 - x2);
  }
}

// event handlers
document.body.onscroll = function(){
  container = canvas.getBoundingClientRect();
};
document.body.onresize = function(){
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width;
  canvas.style.height = height;
  screen_width = width;
  screen_height = height;
  container = canvas.getBoundingClientRect();
};
document.body.onmousedown = function(e) {
    mouseX = e.clientX - container.left;
    mouseY = e.clientY - container.top;
    mouseDown = true;
};
document.body.onmouseup = function(e) {
    mouseX = e.clientX - container.left;
    mouseY = e.clientY - container.top;
    mouseDown = false;
};
document.body.onmousemove = function(e) {
    mouseX = e.clientX - container.left;
    mouseY = e.clientY - container.top;
};
document.body.onkeydown = function(e) {
    keyDown[e.keyCode] = true;
};
document.body.onkeyup = function(e) {
    keyDown[e.keyCode] = false;
};

function run(){
  rect(0, 0, screen_width, screen_height);
  fill('#000000');
  
  circle(mouseX, mouseY, score);
  fill('#ffffff');
  
  spawn_counter --;
  if(spawn_counter <= 0){
    spawn_counter = 10;
    
    var spawn_side = Math.round(Math.random() * 3);
    var spawn_x = 0;
    var spawn_y = 0;
    var spawn_xv = 0;
    var spawn_yv = 0;
    
    if(spawn_side === 0){
      spawn_x = 0;
      spawn_y = Math.random() * screen_height;
      spawn_xv = Math.random() * 2;
      spawn_yv = Math.random() * 4 - 2;
    }
    if(spawn_side === 1){
      spawn_y = 0;
      spawn_x = Math.random() * screen_height;
      spawn_yv = Math.random() * 2;
      spawn_xv = Math.random() * 4 - 2;
    }
    if(spawn_side === 2){
      spawn_x = screen_width;
      spawn_y = Math.random() * screen_height;
      spawn_xv = -Math.random() * 2;
      spawn_yv = Math.random() * 4 - 2;
    }
    if(spawn_side === 3){
      spawn_y = screen_height;
      spawn_x = Math.random() * screen_height;
      spawn_yv = -Math.random() * 2;
      spawn_xv = Math.random() * 4 - 2;
    }
    
    circles.push([spawn_x, spawn_y, spawn_xv, spawn_yv, (Math.random()*score*1.5) + 5, '#'+Math.floor(Math.random()*16777215).toString(16)]);
  }
  
  for(var i = 0; i < circles.length; i ++){
    circle(circles[i][0], circles[i][1], circles[i][4]);
    fill(circles[i][5]);
    circles[i][0] += circles[i][2];
    circles[i][1] += circles[i][3];
    
    var a = circles[i][0] - mouseX;
    var b = circles[i][1] - mouseY;
    if(Math.sqrt(a*a + b*b) < score + circles[i][4]){
      if(circles[i][4] < score){
        score ++;
        circles.splice(i, 1);
        i --;
      }
      else{
        circles = [];
        spawn_counter = 0;
        mouseX = screen_width/2;
        mouseY = screen_height/2;
        score = 10;
      }
    }
    else if(circles[i][0] < -circles[i][5]){
      circles.splice(i, 1);
      i --;
    }
    else if(circles[i][1] < -circles[i][1]){
      circles.splice(i, 1);
      i --;
    }
    else if(circles[i][0] > screen_width + circles[i][5]){
      circles.splice(i, 1);
      i --;
    }
    else if(circles[i][1] > screen_height + circles[i][1]){
      circles.splice(i, 1);
      i --;
    }
  }
}

app('ctx', 0, 0, true);

var score = 10;
var circles = [];
var spawn_counter = 0;

mouseX = screen_width/2;
mouseY = screen_height/2;

setInterval(run, 1000/60);
