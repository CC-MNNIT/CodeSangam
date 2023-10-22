import React, { useState, useEffect } from 'react';
import first from "../Assets/first.jpg";
import second from "../Assets/second.jpg";
import third from "../Assets/third.jpg";

interface props {
    firstStudentName: string;
    secondStudentName: string;
    thirdStudentName: string
}


export default function Podium({ firstStudentName, secondStudentName, thirdStudentName }: props) {
    const [topDivOpacity, setTopDivOpacity] = useState(1);
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        setTopDivOpacity(1 - currentScroll / 250);
    });
    return (
        <div style={{ width: "100vw", height: "100vh", opacity: topDivOpacity }}>
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh" }}>
                <div className="container podium">
                    <div className="podium__item">
                        <div className="podium__rank second">
                            <div className="loader2">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className='image-cropper'>
                            <img src={second} alt="" />
                            </div>
                        </div>
                        <p className="podium__city">Rank#2</p>
                        <p className="podium__city">{secondStudentName}</p>
                    </div>
                    <div className="podium__item">
                        <div className="podium__rank first">
                            <div className="loader1">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className='image-cropper'>
                            <img src={first} alt="" />
                            </div>
                        </div>
                        <p className="podium__city">Rank#1</p>
                        <p className="podium__city">{firstStudentName}</p>
                    </div>
                    <div className="podium__item">
                        <div className="podium__rank third">
                            <div className="loader3">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className='image-cropper'>
                            <img src={third} alt="" />
                            </div>
                        </div>
                        <p className="podium__city">Rank#3</p>
                        <p className="podium__city">{thirdStudentName}</p>
                    </div>
                </div>
            </div>
            <div className='line' style={{ position: "absolute", bottom: "0px", marginBottom: "50px", textAlign: 'center', width: "100vw", textTransform: "uppercase" }}>
                <h2 className='lineUp'>Scroll down to see complete Leaderboard</h2>
            </div>
        </div>
    )
}