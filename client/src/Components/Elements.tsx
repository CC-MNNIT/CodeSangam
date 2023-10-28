import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import rocket from "../Assets/rocket.svg";
import rover from "../Assets/rover.svg";
import anstronaut from "../Assets/anstronaut.svg";
import anstronaut2 from "../Assets/anstronaut2.svg";

export default function Elements() {
    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.innerHTML = `radius=(1 + 0.5 + 0.35) * window.innerHeight,fields=$(".item-elements"),container=$("#container"),width=container.width(),height=container.height(),angle=0,step=2*Math.PI/fields.length;fields.each(function(){var t=Math.round(width/2+radius*Math.cos(angle)-$(this).width()/2),i=Math.round(height/2+radius*Math.sin(angle)-$(this).height()/2);$(this).css({left:t+"px",top:i+"px"}),angle+=step});`;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="container" style={{zIndex: "900", position: "absolute", rotate: "0deg" }}>
            <div style={{ width: 0.12 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.12 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.35 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "89deg" }} className="item-elements">
                <img className="moon-items" src={rocket} alt="" />
            </div>
            <div style={{ width: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.35 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "127deg" }} className="item-elements">
                <img className="moon-items" src={anstronaut} alt="" />
            </div>
            <div style={{ width: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.35 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "171deg" }} className="item-elements">
                <img className="moon-items" src={rover} alt="" />
            </div>
            <div style={{ width: 0.12 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.12 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.35 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "210deg" }} className="item-elements">
                <img className="moon-items" src={rocket} alt="" />
            </div>
            <div style={{ width: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.35 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "-126deg" }} className="item-elements">
                <img className="moon-items" src={anstronaut} alt="" />
            </div>
            <div style={{ width: 0.12 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.12 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.35 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "-69deg" }} className="item-elements">
                <img className="moon-items" src={rocket} alt="" />
            </div>
            <div style={{ width: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.35 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "-29deg" }} className="item-elements">
                <img className="moon-items" src={rover} alt="" />
            </div>
            <div style={{ width: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.25 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "9deg" }} className="item-elements">
                <img className="moon-items" src={anstronaut2} alt="" />
            </div>
            <div style={{ width: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, height: 0.1 * (1 + 0.5 + 0.35) * window.innerHeight, transform: `translateY(-${0.35 * 0.1 * (1 + 0.5 + 0.35) * window.innerHeight}px)`, rotate: "49deg" }} className="item-elements">
                <img className="moon-items" src={rover} alt="" />
            </div>
        </div>
    );
}
