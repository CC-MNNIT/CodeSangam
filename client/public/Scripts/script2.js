var factor = 2;
var radius = Math.sqrt((screen.width * screen.width) + (factor * screen.height * factor * screen.height)) / 2; // adjust to move out items in and out 
//var radius = 100; // adjust to move out items in and out 
var fields = $('.item'),
  container = $('#container'),
  width = container.width(),
  height = container.height();
  console.log(width); 
var angle = 0,
  step = (2 * Math.PI) / fields.length;
fields.each(function() {
  var x = Math.round(width / 2 + radius * Math.cos(angle) - $(this).width() / 2);
  var y = Math.round(height / 2 + radius * Math.sin(angle) - $(this).height() / 2);
  // if (window.console) {
  //   console.log($(this).text(), x, y);
  // }
  $(this).css({
    left: x + 'px',
    top: y + 'px',
  });
  angle += step;
});

// let angz = 0;

// function myfun(){
//   console.log("hello");
//   angz=angz+72;
//   console.log(angz);
//   let ram=`rotate(${angz}+deg)`;
//   console.log(ram);
//   document.getElementById("container").style.transform = `rotate(${angz}deg)`;
// }