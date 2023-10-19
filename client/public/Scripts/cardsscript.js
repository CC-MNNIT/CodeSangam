window.onload = function() {

    var parallaxBox = document.getElementById('space-card-box');
    var c1left = document.getElementById('l1').offsetLeft,
        c1top = document.getElementById('l1').offsetTop,
        c2left = document.getElementById('l2').offsetLeft,
        c2top = document.getElementById('l2').offsetTop,
        c3left = document.getElementById('l3').offsetLeft,
        c3top = document.getElementById('l3').offsetTop,
        c4left = document.getElementById('l4').offsetLeft,
        c4top = document.getElementById('l4').offsetTop;
  
    parallaxBox.onmousemove = function(event) {
      event = event || window.event;
      var x = event.clientX - parallaxBox.offsetLeft,
          y = event.clientY - parallaxBox.offsetTop;
  
      mouseParallax('l1', c1left, c1top, x, y, 5);
      mouseParallax('l2', c2left, c2top, x, y, 15);
      mouseParallax('l3', c3left, c3top, x, y, 20);
      mouseParallax('l4', c4left, c4top, x, y, 25);
    }
  
  }
  
  function mouseParallax(id, left, top, mouseX, mouseY, speed) {
    var obj = document.getElementById(id);
    var parentObj = obj.parentNode,
        containerWidth = parseInt(parentObj.offsetWidth),
        containerHeight = 470;
    console.log(containerWidth);
    obj.style.left = left - (((mouseX - (parseInt(obj.offsetWidth) / 2 + left)) / containerWidth) * speed) + 'px';
    obj.style.top = top - (((mouseY - (parseInt(obj.offsetHeight) / 2 + top)) / containerHeight) * speed) + 'px';
  }