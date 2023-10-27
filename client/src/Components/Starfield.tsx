import React, { useEffect, useState } from "react";

const MAX_Z = 2;
const MAX_R = 1;
const Z_SPD = 1;
const PARTICLES: Particle[] = [];

class Particle {
    x: number;
    y: number;
    z: number;
    vel: Vector;
    fill: string;
    stroke: string;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        const X_VEL = 0,
            Y_VEL = 0,
            Z_VEL = -Z_SPD;
        this.vel = new Vector(X_VEL, Y_VEL, Z_VEL);
        this.vel.scale(0.005);
        this.fill = "rgba(255, 255, 255, 0.3)";
        this.stroke = this.fill;
    }

    update() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.z += this.vel.z;
    }

    render(context: CanvasRenderingContext2D, W: number, H: number, XO: number, YO: number) {
        const PIXEL = to2d(this, W, H, XO, YO);
        const X = PIXEL[0];
        const Y = PIXEL[1];
        const R = (MAX_Z - this.z) / MAX_Z * MAX_R;

        if (X < 0 || X > W || Y < 0 || Y > H) this.z = MAX_Z;

        this.update();
        context.beginPath();
        context.fillStyle = this.fill;
        context.strokeStyle = this.stroke;
        context.arc(X, PIXEL[1], R, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.closePath();
    }
}

class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v: Vector) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    scale(n: number) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
    }
}

function to2d(particle: Particle, W: number, H: number, XO: number, YO: number) {
    const X_COORD = particle.x - XO;
    const Y_COORD = particle.y - YO;
    const PX = X_COORD / particle.z;
    const PY = Y_COORD / particle.z;
    return [PX + XO, PY + YO];
}

function Starfield() {
    window.onload = function () {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const XO = W / 2;
        const YO = H / 2;
        const NUM_PARTICLES = 400;

        console.log("values", W, H, XO, YO)

        const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;
        canvas.width = W;
        canvas.height = H;
        const context = canvas.getContext("2d");

        function render() {
            for (let i = 0; i < PARTICLES.length; i++) {
                if (context) {
                    PARTICLES[i].render(context, W, H, XO, YO);
                }
            }
        }

        function loop() {
            window.requestAnimationFrame(loop);
            if (context) {
                context.fillStyle = "rgba(0, 0, 0, 0.15)";
                context.fillRect(0, 0, W, H);
            }
            render();
        }

        function createParticles() {
            for (let i = 0; i < NUM_PARTICLES; i++) {
                const X = Math.random() * W;
                const Y = Math.random() * H;
                const Z = Math.random() * MAX_Z;
                PARTICLES.push(new Particle(X, Y, Z));
            }
        }

        createParticles();
        loop();
    }

    return (<canvas style={{ width: "100%", height: "100%", color: "wheat", display: "flex" }} className="fixed" id="main_canvas">Hello</canvas>);
}

export default Starfield;
