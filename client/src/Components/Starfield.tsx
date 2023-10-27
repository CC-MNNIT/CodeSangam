import React, { useEffect } from "react";


// export default function Starfield() {

//     var starfield = null as any;

//     window.onload = function () {
//         starfield = new (jsStarfield as any);
//         starfield.init("main_canvas");
//         _loop_();
//     };

//     const refresh = async () => {
//         await new Promise(res => setTimeout(res, 5));
//         if (starfield) {
//             starfield.init("main_canvas");
//         }
//     };
//     window.addEventListener("focus", refresh);
//     window.addEventListener("blur", refresh);

//     function _loop_(this: any) {
//         window.requestAnimationFrame(_update_);
//     }

//     function _update_(time: any) {
//         starfield.update(time);
//         _loop_();
//     }

//     function Vector2(this: any, x: any, y: any) {
//         this.x = x;
//         this.y = y;
//     }

//     function Vector3(this: any, x: any, y: any, z: any) {
//         this.x = x;
//         this.y = y;
//         this.z = z;
//     }

//     function rand_range(min: any, max: any) { return min + Math.random() * (max - min); }

//     function jsStarfield(this: any) {
//         this.stars = [];

//         this.max_depth = 1000;
//         this.max_size = 3;
//         this.speed = 240;
//         this.amount = 1000;

//         this.follow_mouse = false;
//         this.method = "rects";

//         this.last_frame = 0;
//         this.fps_time = 0;
//         this.fps_count = 0;
//         this.fps = 0;

//         this.origin = new (Vector2 as any)(0, 0);

//         this.init = function (canvas: any) {
//             this.canvas = document.getElementById(canvas);
//             this.ctx = this.canvas.getContext('2d');
//             this.resize(window.innerWidth, window.innerHeight);
//             this.ctx.font = "18px Arial";

//             this.reset_origin();

//             this.canvas.addEventListener('mousemove', function (event: any) {
//                 if (starfield.follow_mouse == true)
//                     starfield.set_origin(event.x, event.y);
//             });

//             // clear the array
//             this.stars.length = 0;
//             this.init_stars();
//         };

//         this.set_amount = function (amount: any) {
//             this.amount = Math.floor(amount);

//             if (this.amount < this.stars.length) {
//                 this.stars.length = this.amount;
//             }
//             else {
//                 var amt = this.amount - this.stars.length;

//                 for (var i = 0; i < amt; i++) {
//                     let a = rand_range(-this.canvas.width, this.canvas.width);
//                     let b = rand_range(-this.canvas.height, this.canvas.height);
//                     let c = rand_range(1, this.max_depth);
//                     this.stars.push(new (Vector3 as any)(a, b, c));
//                 }
//             }
//         };

//         this.init_stars = function () {
//             // init the stars
//             for (var i = 0; i < this.amount; i++) {
//                 let a = rand_range(-this.canvas.width, this.canvas.width);
//                 let b = rand_range(-this.canvas.height, this.canvas.height);
//                 let c = rand_range(1, this.max_depth);
//                 this.stars.push(new (Vector3 as any)(a, b, c));
//             }
//         };

//         this.update = function (time: any) {
//             var delta_time = (time - this.last_frame) * 0.001;
//             this.update_stars(delta_time);

//             if (this.method === "rects")
//                 this.draw_rects();
//             else
//                 this.draw_buffer();

//             this.draw_fps(delta_time);

//             this.last_frame = time;
//         };

//         this.update_stars = function (delta_time: any) {
//             var distance = this.speed * delta_time;

//             for (var i = 0; i < this.stars.length; i++) {
//                 var star = this.stars[i];

//                 star.z -= distance;

//                 if (star.z <= 0) {
//                     star.x = rand_range(-this.canvas.width, this.canvas.width);
//                     star.y = rand_range(-this.canvas.height, this.canvas.height);
//                     star.z = this.max_depth;
//                 }
//             }
//         };

//         this.resize = function (width: any, height: any) {
//             this.canvas.width = width;
//             this.canvas.height = height;

//             this.canvas.style.width = width + "px";
//             this.canvas.style.height = height + "px";

//             // get the buffer
//             this.img_data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

//             this.reset_origin();
//         };

//         this.draw_rects = function () {
//             this.ctx.fillStyle = 'rgb(255,255,255)';
//             this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

//             for (var i = 0; i < this.stars.length; i++) {
//                 var star = this.stars[i];
//                 var k = 256 / star.z;
//                 var x = star.x * k + this.origin.x;
//                 var y = star.y * k + this.origin.y;

//                 var size = ((this.max_depth - star.z) / this.max_depth) * this.max_size;
//                 this.ctx.fillRect(x, y, size, size);
//             }
//         };

//         this.draw_buffer = function () {
//             var pos = 0, x, y;
//             var length = this.img_data.data.length;
//             var width = this.img_data.width * 4;

//             for (pos = 0; pos < length; pos++)
//                 this.img_data.data[pos] = 0;

//             for (var i = 0; i < this.stars.length; i++) {
//                 var star = this.stars[i];

//                 var k = 256 / star.z;
//                 var x: any = Math.floor(star.x * k + this.origin.x);
//                 var y: any = Math.floor(star.y * k + this.origin.y);

//                 if (x > 0 && x < this.canvas.width && y > 0 && y < this.canvas.height) {
//                     pos = y * width + (x * 4);

//                     this.img_data.data[pos] = 255;
//                     this.img_data.data[pos + 1] = 255;
//                     this.img_data.data[pos + 2] = 255;
//                     this.img_data.data[pos + 3] = ((this.max_depth - star.z) / this.max_depth) * 255;
//                 }
//             }

//             this.ctx.putImageData(this.img_data, 0, 0);
//         };

//         this.draw_fps = function (delta_time: any) {
//             this.fps_time += delta_time;
//             this.fps_count++;

//             // update the fps count every second
//             if (this.fps_time > 1) {
//                 this.fps = Math.floor(this.fps_count / this.fps_time);
//                 this.fps_time = 0;
//                 this.fps_count = 0;
//             }

//             //this.ctx.fillText("FPS: " + this.fps, 10, 25);
//         };

//         this.set_origin = function (x: any, y: any) {
//             this.origin.x = x;
//             this.origin.y = y;
//         };

//         this.reset_origin = function () {
//             this.origin.x = this.canvas.width / 2;
//             this.origin.y = this.canvas.height / 2;
//         };
//     }


//     return (<canvas style={{ color: "wheat", display: "flex" }} className="fixed" id="main_canvas">Hello</canvas>);
// }


export default function Starfield() {
  return (
    <div style={{width: "100vw", height: "100vh", backgroundColor: "rgba(1,1,1,1)"}} className="fixed">
      
    </div>
  )
}
