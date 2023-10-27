import React, { useState, useEffect } from "react";
import Cards from "./Cards";
import Card2 from "./Card2";
import Stations from "./Stations";
import moon from "../Assets/moon.svg";
import right from "../Assets/right.png";
import left from "../Assets/left.png";
import { log } from "console";

const LandingPage = () => {
    const { innerWidth: width, innerHeight: height } = window;
    var factor = 3;
    if (width < 640) factor = 0.5;
    const [topDivOpacity, setTopDivOpacity] = useState(1);
    const [divHeight, setDivHeight] = useState(1000000);
    const [angle, setAngle] = useState(0);
    const [moonRadius, setMoonRadius] = useState(0);
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
        //     setFactor(2)
        // }

        const newMoonRadius =
            Math.sqrt(width * width + factor * height * factor * height) / 2;
        setMoonRadius(newMoonRadius);
        const blurLength = 500;
        const moonSegLength = newMoonRadius - (factor * height) / 2;
        setDivHeight(height + blurLength + moonSegLength);
    }, []);

    return (
        <div>
            {/* small ------------------------------------ screen -------------------------------- part */}
            <div className="small-screen-landing-page" style={{ overflow: "hidden", height: 3 * divHeight }}>
                <div className="scale-0 md:scale-100 lg:scale-100" style={{ zIndex: "50000000", position: "fixed", top: "50vh", right: "0", opacity: 1 - topDivOpacity * 2, width: "100px", height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img className="arrows cursor-pointer" onClick={() => { rightrotateMoon(); }} width="100" height="100" src={right} alt="forward--v1" />
                </div>
                <div className="scale-0 md:scale-100 lg:scale-100" style={{ zIndex: "50000000", position: "fixed", top: "50vh", left: "0", opacity: 1 - topDivOpacity * 2, width: "100px", height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img className="arrows cursor-pointer" onClick={() => { leftrotateMoon(); }} width="100" height="100" src={left} alt="backward--v1" />
                </div>
                <div style={{ opacity: topDivOpacity }} className="my-auto mx-auto scale-50 md:scale-75 lg:scale-100 logo">
                    <div className="flex justify-center">
                        <div>C</div><img className="photo rotate spinner" src={moon} alt="moon with rover"></img>DE<div className="blink">SAN</div><div>GAM</div>
                    </div>
                </div>
                <div style={{ width: "100vw", height: divHeight / 2 }}></div>
                {/* cards--- */}
                <div className="scale-100 md:scale-0 lg:scale-0" style={{ zIndex: "500000000000000000000", width: "100vw", height: "100vh" }}>
                    <div className="bg-transparent one scale-100 flex justify-center items-center">
                        <Card2
                            leftrotateMoon={leftrotateMoon}
                            rightrotateMoon={rightrotateMoon}
                            eventn="Webster"
                            eventdescription="Webster is a web development-focused event, emphasizing the enhancement of participants' skills in creating web applications. It provides opportunities for individuals to learn about web technologies, frameworks, and best practices in the field."
                            teamsize="Team Size: (1 - 3)"
                        />
                    </div>
                    <div style={{ height: "10px" }}></div>
                    <div className="bg-transparent two scale-100 flex justify-center items-center">
                        <Card2
                            leftrotateMoon={leftrotateMoon}
                            rightrotateMoon={rightrotateMoon}
                            eventn="Droidrush"
                            eventdescription="Droidrush is an event centered around Android development, where participants can delve into the world of Android app development. This event offers hands-on experience in building Android applications, exploring the Android ecosystem, and understanding mobile app design principles."
                            teamsize="Team Size: (1 - 3)"
                        />
                    </div>
                    <div style={{ height: "10px" }}></div>
                    <div className="bg-transparent three scale-100 flex justify-center items-center">
                        <Card2
                            leftrotateMoon={leftrotateMoon}
                            rightrotateMoon={rightrotateMoon}
                            eventn="Logical Rhythm"
                            eventdescription="Logical Rythm is a machine learning event that empowers participants with essential knowledge and skills in data analysis, algorithm development, and model training. This event equips attendees with a strong foundation in artificial intelligence and data science, preparing them for exciting opportunities in these fields."
                            teamsize="Team Size: (1 - 3)"
                        />
                    </div>
                    <div style={{ height: "10px" }}></div>
                    <div className="bg-transparent four scale-100 flex justify-center items-center">
                        <Card2
                            leftrotateMoon={leftrotateMoon}
                            rightrotateMoon={rightrotateMoon}
                            eventn="Softablitz"
                            eventdescription="Softablitz is a Java Desktop Development event that immerses participants in the world of desktop application creation using the Java programming language. It provides hands-on experience, helping participants refine their Java skills while designing and developing powerful desktop software."
                            teamsize="Team Size: (1 - 3)"
                        />
                    </div>
                    <div style={{ height: "10px" }}></div>
                    <div className="bg-transparent five scale-100 flex justify-center items-center">
                        <Card2
                            leftrotateMoon={leftrotateMoon}
                            rightrotateMoon={rightrotateMoon}
                            eventn="ContriHub"
                            eventdescription="Softablitz is a Java Desktop Development event that immerses participants in the world of desktop application creation using the Java programming language. It provides hands-on experience, helping participants refine their Java skills while designing and developing powerful desktop software."
                            teamsize="Team Size: 1"
                        />
                    </div>
                </div>
            </div>
            {/* big ------------------------------------ screen -------------------------------- part */}
            <div className="big-screen-landing-page" style={{ overflow: "hidden", height: divHeight }} >
                <div style={{ zIndex: "50000000", position: "fixed", top: "50vh", right: "0", opacity: 1 - topDivOpacity * 2, width: "100px", height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img className="arrows cursor-pointer" onClick={() => { rightrotateMoon(); }} width="100" height="100" src={right} alt="forward--v1" />
                </div>
                <div style={{ zIndex: "50000000", position: "fixed", top: "50vh", left: "0", opacity: 1 - topDivOpacity * 2, width: "100px", height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img className="arrows cursor-pointer" onClick={() => { leftrotateMoon(); }} width="100" height="100" src={left} alt="backward--v1" />
                </div>
                <div style={{ opacity: topDivOpacity }} className="my-auto mx-auto scale-50 md:scale-75 lg:scale-100 logo">
                    <div className="flex justify-center">
                        <div>C</div><img className="photo rotate spinner" src={moon} alt="moon with rover"></img>DE<div className="blink">SAN</div><div>GAM</div></div>
                </div>
                <div style={{ width: "100vw", height: divHeight }}></div>
                <div style={{ width: "calc(100vw)", height: `calc(${factor} * 100vh)`, display: "flex", justifyContent: "center", alignItems: "center", }}>
                    <div style={{ width: 2 * moonRadius, height: 2 * moonRadius, display: "flex", justifyContent: "center", alignItems: "center", transition: "transform 2s", transform: `rotate(${angle}deg)` }} >
                        <img style={{ maxWidth: "none", width: 2 * moonRadius, height: 2 * moonRadius, }} src={moon} alt="moon" />
                        <Stations leftrotateMoon={leftrotateMoon} rightrotateMoon={rightrotateMoon} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;