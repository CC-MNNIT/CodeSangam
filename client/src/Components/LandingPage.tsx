import React, { useState, useEffect } from "react";
import Cards from "./Cards";
import Stations from "./Stations";
import moon from "../Assets/moon.svg";
import right from "../Assets/right.png";
import left from "../Assets/left.png";
import { log } from "console";

const LandingPage = () => {
    const [topDivOpacity, setTopDivOpacity] = useState(1);
    const [divHeight, setDivHeight] = useState(1000);
    const [angle, setAngle] = useState(0);
    const [moonRadius, setMoonRadius] = useState(0);
    const [factor, setFactor] = useState(3);
    const leftrotateMoon = () => {
        setAngle(angle + 72);
    };
    const rightrotateMoon = () => {
        setAngle(angle - 72);
    };
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        setTopDivOpacity(1 - currentScroll / 500);
    });

    useEffect(() => {
        const { innerWidth: width, innerHeight: height } = window;
        // console.log(width);
        // console.log(height);

        // if (width < 640) {
        //     setFactor(2.3)
        // }

        const newMoonRadius =
            Math.sqrt(width * width + factor * height * factor * height) / 2;
        setMoonRadius(newMoonRadius);
        const blurLength = 500;
        const moonSegLength = newMoonRadius - (factor * height) / 2;
        setDivHeight(height + blurLength + moonSegLength);
    }, []);

    return (
        <div
            className="relative"
            style={{ overflow: "hidden", width: "100vw", height: divHeight }}
        >
            <div style={{ position: "fixed", top: "50vh", right: "0", opacity: 1 - topDivOpacity * 2, width: "100px", height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img className="arrows cursor-pointer" onClick={() => { rightrotateMoon(); }} width="100" height="100" src={right} alt="forward--v1" />
            </div>
            <div style={{ position: "fixed", top: "50vh", left: "0", opacity: 1 - topDivOpacity * 2, width: "100px", height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img className="arrows cursor-pointer" onClick={() => { leftrotateMoon(); }} width="100" height="100" src={left} alt="backward--v1" />
            </div>
            <div style={{ opacity: topDivOpacity }} className="max-w-screen-xl logo">
                <div className="b flex items-center">
                    C
                    <img
                        className="rotate spinner"
                        src={moon}
                        alt="moon with rover"
                    ></img>
                    DE<span className="blink">SAN</span>GAM
                </div>
            </div>
            <div style={{ width: "100vw", height: divHeight }}></div>

            <div
                style={{
                    width: "calc(100vw)",
                    height: `calc(${factor} * 100vh)`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 2 * moonRadius,
                        height: 2 * moonRadius,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "transform 2s",
                        transform: `rotate(${angle}deg)`,
                    }}
                >
                    <img
                        style={{
                            maxWidth: "none",
                            width: 2 * moonRadius,
                            height: 2 * moonRadius,
                        }}
                        src={moon}
                        alt="moon"
                    />
                    {/* <Stations leftrotateMoon={leftrotateMoon} rightrotateMoon={rightrotateMoon} /> */}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
