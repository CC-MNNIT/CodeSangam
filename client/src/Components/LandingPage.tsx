import React, { useState, useEffect } from 'react';
import moon from "../Assets/moon.svg";
import "./Styles.css";
import "./ButtonStyle.css";
import "./CardsStyle.css";

const LandingPage = () => {

    const [topDivOpacity, setTopDivOpacity] = useState(1);
    const [divHeight, setDivHeight] = useState(1000);
    const [angle, setAngle] = useState(0);
    const [moonRadius, setMoonRadius] = useState(0);
    const [factor, setFactor] = useState(2);
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
        const script1 = document.createElement('script');
        const script2 = document.createElement('script');
        const cardsscript = document.createElement('script');

        script1.src = "./Scripts/script1.js";
        script2.src = "./Scripts/script2.js";
        cardsscript.src = "./Scripts/cardsscript.js";
        script1.async = true;
        script2.async = true;
        cardsscript.async = true;
        document.body.appendChild(script1);
        document.body.appendChild(script2);
        //document.body.appendChild(cardsscript);

        return () => {
            document.body.removeChild(script1);
            document.body.removeChild(script2);
        }
    }, []);

    useEffect(() => {

        const { innerWidth: width, innerHeight: height } = window;
        const newMoonRadius = Math.sqrt((width * width) + (factor * height * factor * height)) / 2;
        console.log(width);
        console.log(height);
        console.log(newMoonRadius);
        setMoonRadius(newMoonRadius);
        const blurLength = 500;
        const moonSegLength = newMoonRadius - factor * height / 2;
        setDivHeight(height + blurLength + moonSegLength);
    }, []);


    return (
        <div className='relative' style={{ overflow: "hidden", width: "100vw", height: divHeight }}>

            <canvas className='fixed' id="main_canvas">
            </canvas>
            <div style={{ opacity: topDivOpacity }} className="fixed logo"><b>C<img className="rotate spinner" src='https://i.imgur.com/2Z3Svuj.png' alt="moon"></img>DE<span>SAN</span>GAM</b></div>
            <div style={{ width: "100vw", height: divHeight }}></div>

            <div style={{ width: "calc(100vw)", height: `calc(${factor} * 100vh)`, display: "flex", justifyContent: "center", alignItems: "center" }}>


                <div style={{ width: 2 * moonRadius, height: 2 * moonRadius, display: "flex", justifyContent: "center", alignItems: "center", transition: "transform 2s", transform: `rotate(${angle}deg)` }}>


                    <img style={{ maxWidth: "none", width: 2 * moonRadius, height: 2 * moonRadius }} src={moon} alt="moon" />
                    <div id="container" style={{ position: "absolute" }}>
                        <div className="item" style={{ rotate: "89deg" }}>
                            <div className="wrapper">
                                <div id="space-card-box" className="space-card">
                                    <div className="space-card-left">
                                        <div className="space-card-left-title">Event 3</div>
                                        <div className="space-card-left-subtext">
                                            Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </div>
                                        <div className="space-card-left-planets">
                                            <div className="space-card-left-planet-1"></div>
                                            <div className="space-card-left-planet-2"></div>
                                            <div className="space-card-left-planet-3"></div>
                                        </div>
                                        <div className="space-card-left-button">
                                            <button>Explore</button>
                                            <button onClick={() => { leftrotateMoon(); }}>➔</button>
                                        </div>
                                    </div>
                                    <div className="space-card-right">
                                        <div className="space-card-right-sun"></div>
                                        <div id="l2" className="space-card-right-planet-1"></div>
                                        <div id="l3" className="space-card-right-planet-2"></div>
                                        <div id="l4" className="space-card-right-planet-3"></div>
                                        <div id="l1" className="space-card-right-stars-container">
                                            <div className="space-card-right-stars"></div>
                                            <div className="space-card-right-shootingstar-1"></div>
                                            <div className="space-card-right-shootingstar-2"></div>
                                            <div className="space-card-right-shootingstar-3"></div>
                                            <div className="space-card-right-shootingstar-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item" style={{ rotate: "161deg" }}>
                            <div className="wrapper">
                                <div id="space-card-box" className="space-card">
                                    <div className="space-card-left">
                                        <div className="space-card-left-title">Event 4</div>
                                        <div className="space-card-left-subtext">
                                            Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </div>
                                        <div className="space-card-left-planets">
                                            <div className="space-card-left-planet-1"></div>
                                            <div className="space-card-left-planet-2"></div>
                                            <div className="space-card-left-planet-3"></div>
                                        </div>
                                        <div className="space-card-left-button">
                                            <button>Explore</button>
                                            <button onClick={() => { leftrotateMoon(); }}>➔</button>
                                        </div>
                                    </div>
                                    <div className="space-card-right">
                                        <div className="space-card-right-sun"></div>
                                        <div id="l2" className="space-card-right-planet-1"></div>
                                        <div id="l3" className="space-card-right-planet-2"></div>
                                        <div id="l4" className="space-card-right-planet-3"></div>
                                        <div id="l1" className="space-card-right-stars-container">
                                            <div className="space-card-right-stars"></div>
                                            <div className="space-card-right-shootingstar-1"></div>
                                            <div className="space-card-right-shootingstar-2"></div>
                                            <div className="space-card-right-shootingstar-3"></div>
                                            <div className="space-card-right-shootingstar-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item" style={{ rotate: "-127deg" }}>
                            <div className="wrapper">
                                <div id="space-card-box" className="space-card">
                                    <div className="space-card-left">
                                        <div className="space-card-left-title">Event 5</div>
                                        <div className="space-card-left-subtext">
                                            Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </div>
                                        <div className="space-card-left-planets">
                                            <div className="space-card-left-planet-1"></div>
                                            <div className="space-card-left-planet-2"></div>
                                            <div className="space-card-left-planet-3"></div>
                                        </div>
                                        <div className="space-card-left-button">
                                            <button>Explore</button>
                                            <button onClick={() => { leftrotateMoon(); }}>➔</button>
                                        </div>
                                    </div>
                                    <div className="space-card-right">
                                        <div className="space-card-right-sun"></div>
                                        <div id="l2" className="space-card-right-planet-1"></div>
                                        <div id="l3" className="space-card-right-planet-2"></div>
                                        <div id="l4" className="space-card-right-planet-3"></div>
                                        <div id="l1" className="space-card-right-stars-container">
                                            <div className="space-card-right-stars"></div>
                                            <div className="space-card-right-shootingstar-1"></div>
                                            <div className="space-card-right-shootingstar-2"></div>
                                            <div className="space-card-right-shootingstar-3"></div>
                                            <div className="space-card-right-shootingstar-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item" style={{ rotate: "-55deg" }}>
                            <div className="wrapper">
                                <div id="space-card-box" className="space-card">
                                    <div className="space-card-left">
                                        <div className="space-card-left-title">Event 1</div>
                                        <div className="space-card-left-subtext">
                                            Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </div>
                                        <div className="space-card-left-planets">
                                            <div className="space-card-left-planet-1"></div>
                                            <div className="space-card-left-planet-2"></div>
                                            <div className="space-card-left-planet-3"></div>
                                        </div>
                                        <div className="space-card-left-button">
                                            <button>Explore</button>
                                            <button onClick={() => { leftrotateMoon(); }}>➔</button>
                                        </div>
                                    </div>
                                    <div className="space-card-right">
                                        <div className="space-card-right-sun"></div>
                                        <div id="l2" className="space-card-right-planet-1"></div>
                                        <div id="l3" className="space-card-right-planet-2"></div>
                                        <div id="l4" className="space-card-right-planet-3"></div>
                                        <div id="l1" className="space-card-right-stars-container">
                                            <div className="space-card-right-stars"></div>
                                            <div className="space-card-right-shootingstar-1"></div>
                                            <div className="space-card-right-shootingstar-2"></div>
                                            <div className="space-card-right-shootingstar-3"></div>
                                            <div className="space-card-right-shootingstar-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item" style={{ rotate: "17deg" }}>
                            <div className="wrapper">
                                <div id="space-card-box" className="space-card">
                                    <div className="space-card-left">
                                        <div className="space-card-left-title">Event 2</div>
                                        <div className="space-card-left-subtext">
                                            Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </div>
                                        <div className="space-card-left-planets">
                                            <div className="space-card-left-planet-1"></div>
                                            <div className="space-card-left-planet-2"></div>
                                            <div className="space-card-left-planet-3"></div>
                                        </div>
                                        <div className="space-card-left-button">
                                            <button>Explore</button>
                                            <button onClick={() => { leftrotateMoon(); }}>➔</button>
                                        </div>
                                    </div>
                                    <div className="space-card-right">
                                        <div className="space-card-right-sun"></div>
                                        <div id="l2" className="space-card-right-planet-1"></div>
                                        <div id="l3" className="space-card-right-planet-2"></div>
                                        <div id="l4" className="space-card-right-planet-3"></div>
                                        <div id="l1" className="space-card-right-stars-container">
                                            <div className="space-card-right-stars"></div>
                                            <div className="space-card-right-shootingstar-1"></div>
                                            <div className="space-card-right-shootingstar-2"></div>
                                            <div className="space-card-right-shootingstar-3"></div>
                                            <div className="space-card-right-shootingstar-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>




            </div>


        </div>
    )
}

export default LandingPage