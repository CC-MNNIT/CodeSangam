import React, { useState, useEffect } from 'react';
import moon from "../Assets/moon.svg";
import "./Styles.css"

const LandingPage = () => {

    const [topDivOpacity, setTopDivOpacity] = useState(1);
    const [angle, setAngle] = useState(0);
    const [scale, setScale] = useState(0);
    const leftrotateMoon = () => {
        setAngle(angle - 72);
    }
    const rightrotateMoon = () => {
        setAngle(angle + 72);
    };
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        setTopDivOpacity(1 - currentScroll / 500);

    });

    useEffect(() => {
        const script = document.createElement('script');

        script.src = "./scriptt.js";
        script.async = true;
        console.log(script.src);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {

        const { innerWidth: width, innerHeight: height } = window;
        console.log("xx-" + width);
        console.log("yy-" + height);

        const newScale = 200 * width / height;
        console.log("scale-" + newScale);
        setScale(newScale);

    }, []);


    return (
        <div className='relative h-32 w-32'>
            <button className="absolute left-0 top-0 h-16 w-16" onClick={() => { leftrotateMoon(); }} style={{ zIndex: "50000", position: "fixed", color: "white" }}>Rotate(current angle - {angle})</button>
            <button className='absolute top-0 right-0 h-16 w-16' onClick={() => { rightrotateMoon(); }} style={{ zIndex: "50000", position: "fixed", color: "white" }}>Rotate(current angle - {angle})</button>
            <canvas className='fixed' id="main_canvas">
            </canvas>
            <div style={{ opacity: topDivOpacity }} className="fixed logo"><b>C<img className="rotate spinner" src='https://i.imgur.com/2Z3Svuj.png' alt="moon"></img>DE<span>SAN</span>GAM</b></div>
            <div style={{ overflow: "hidden", height: "calc(170vh)", width: "100vw" }}>
                <div style={{ overflow: "hidden", position: "relative", height: "400vh", width: "100vw", backgroundColor: "", opacity: "1" }}>
                    <div style={{ width: "calc(100vw)", height: "calc(100vh)", transition: "transform 2s", transform: `rotate(${angle}deg)`, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "", opacity: "1", scale: `${scale}%`, position: "absolute", bottom: "0px" }}>
                        <img style={{ position: "absolute", height: "100%" }} src={moon} alt="moon" />
                        <div id="container" style={{ position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", zIndex: 20 }}>
                            <div className="item rotate-[90deg]"></div>
                            <div className="item rotate-[162deg]">2</div>
                            <div className="item rotate-[-127deg]">3</div>
                            <div className="item rotate-[-54deg]">4</div>
                            <div className="item rotate-[18deg]">5</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default LandingPage