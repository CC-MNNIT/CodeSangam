import React from 'react';
import background from "../Assets/background.gif";
import NeonText from "./NeonText";
import "./Styles.css"

const LandingPage = () => {
    return (
        <div>
            <canvas id="main_canvas">
            </canvas>
            <div className="logo absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">CodeSangam</div>
            {/* <div className='text-white text-center h-screen w-screen overflow-hidden'> */}
            {/* <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'><NeonText text="CodeSangam" /></div> */}
            {/* <div className="logo absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-15vh text-white font-extralight font-comfortaa ">CodeSangam</div> */}
            {/* <img className="w-full h-auto" src={background} style={{ width: "cal(100vw)" }} /> */}
            {/* </div > */}
        </div >
    )
}

export default LandingPage