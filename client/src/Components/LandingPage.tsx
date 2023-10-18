import React, { useState } from 'react';
import moon from "../Assets/moon.svg";
import "./Styles.css"

const LandingPage = () => {

    const [topDivOpacity, setTopDivOpacity] = useState(1);
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        setTopDivOpacity(1 - currentScroll / 500);

    });
    return (
        <div>
            <canvas className='fixed' id="main_canvas">
            </canvas>
            <div style={{ opacity: topDivOpacity }} className="fixed logo"><b>C<img className="rotate spinner" src='https://i.imgur.com/2Z3Svuj.png' alt="moon"></img>DE<span>SAN</span>GAM</b></div>
            <div style={{overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 100, backgroundColor: "red", opacity: 0.5, height: "calc(200vh)", width: "calc(100vw)" }}>
            <img style={{scale: "80%", transform: "translateY(1200px)"}} src={moon} alt="moon" />
            </div>
        </div >
    )
}

export default LandingPage