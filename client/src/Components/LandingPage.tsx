import React, { useState } from 'react';
import moon from "../Assets/moon.svg";
import "./Styles.css"

const LandingPage = () => {

    const [topDivOpacity, setTopDivOpacity] = useState(1);
    const [angle, setAngle] = useState(0);
    const rotateMoon = () => {
        setAngle(angle + 72);
    };
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        setTopDivOpacity(1 - currentScroll / 500);

    });
    return (
        <div>
            <button onClick={() => { rotateMoon(); }} style={{ zIndex: "50000", position: "fixed", color: "white" }}>Rotate(current angle - {angle})</button>
            <canvas className='fixed' id="main_canvas">
            </canvas>
            <div style={{ opacity: topDivOpacity }} className="fixed logo"><b>C<img className="rotate spinner" src='https://i.imgur.com/2Z3Svuj.png' alt="moon"></img>DE<span>SAN</span>GAM</b></div>
            <div style={{ overflow: "hidden", position: "relative", zIndex: 100, backgroundColor: "", opacity: 1, height: "calc(200vh+250px)", width: "calc(100vw)" }}>
                <div style={{ overflow: "", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 100, backgroundColor: "red", opacity: 0, height: "calc(200vh)", width: "calc(100vw)" }}>
                </div>
                <div style={{ overflow: "", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", position: "relative", zIndex: 100, backgroundColor: "", opacity: 1, height: "calc(250px)", width: "calc(100vw)" }}>
                    <img style={{ position: "relative", top: "300px", transition: "transform 2s", transform: `rotate(${angle}deg)`, scale: "146%" }} src={moon} alt="moon" />
                </div>
            </div>
        </div >
    )
}

export default LandingPage