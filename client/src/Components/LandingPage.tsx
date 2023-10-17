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
            <canvas id="main_canvas">
            </canvas>
            <div style={{ opacity: topDivOpacity }} className="logo fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">CodeSangam</div>
            {/* <div className='text-white text-center h-screen w-screen overflow-hidden'> */}
            {/* <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'><NeonText text="CodeSangam" /></div> */}
            {/* <div className="logo absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-15vh text-white font-extralight font-comfortaa ">CodeSangam</div> */}
            {/* <img className="w-full h-auto" src={background} style={{ width: "cal(100vw)" }} /> */}
            {/* </div > */}
        </div >
    )
}

export default LandingPage