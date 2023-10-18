import React, { useState } from 'react';
import background from "../Assets/background.gif";
import NeonText from "./NeonText";
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
            {/* <div className="logo fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">CodeSangam</div> */}
            <div style={{ opacity: topDivOpacity }} className="fixed logo"><b>C<img className="rotate spinner" src='https://i.imgur.com/2Z3Svuj.png' alt="moon"></img>DE<span>SAN</span>GAM</b></div>
            {/* <div className='text-white text-center h-screen w-screen overflow-hidden'> */}
            {/* <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'><NeonText text="CodeSangam" /></div> */}
            {/* <div className="logo absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-15vh text-white font-extralight font-comfortaa ">CodeSangam</div> */}
            {/* <img className="w-full h-auto" src={background} style={{ width: "cal(100vw)" }} /> */}
            {/* </div > */}
        </div >
    )
}

export default LandingPage