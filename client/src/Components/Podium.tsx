import React, { useState, useEffect } from 'react';
import first from "../Assets/first.jpg";
import second from "../Assets/second.jpg";
import third from "../Assets/third.jpg";
import { Ranking } from '../Models/ContrihubModel';

interface props {
    first: Ranking;
    second: Ranking;
    third: Ranking;
}


export default function Podium({ first, second, third }: props) {
    const [topDivOpacity, setTopDivOpacity] = useState(1);
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        setTopDivOpacity(1 - currentScroll / 250);
    });
    return (
        <div style={{ width: "100vw", height: "100vh", opacity: topDivOpacity, overflow: "hidden" }}>
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
                            <div className='image-cropper-contri'>
                            <img src={`https://github.com/${second.user_name}.png`} alt="" />
                            </div>
                        </div>
                        <p className="podium__city">#2</p>
                        <p className="podium__city">{second.user_name}</p>
                        <p className="podium__city">{second.reg_no}</p>
                    </div>
                    <div className="podium__item">
                        <div className="podium__rank first">
                            <div className="loader1">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className='image-cropper-contri'>
                            <img src={`https://github.com/${first.user_name}.png`} alt="" />
                            </div>
                        </div>
                        <p className="podium__city">#1</p>
                        <p className="podium__city">{first.user_name}</p>
                        <p className="podium__city">{first.reg_no}</p>
                    </div>
                    <div className="podium__item">
                        <div className="podium__rank third">
                            <div className="loader3">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className='image-cropper-contri'>
                            <img src={`https://github.com/${third.user_name}.png`} alt="" />
                            </div>
                        </div>
                        <p className="podium__city">#3</p>
                        <p className="podium__city">{third.user_name}</p>
                        <p className="podium__city">{third.reg_no}</p>
                    </div>
                </div>
            </div>
            <div className='line' style={{ position: "absolute", bottom: "0px", marginBottom: "50px", textAlign: 'center', width: "100vw", textTransform: "uppercase" }}>
                <h2 className='lineUp'>Scroll down to see complete Leaderboard</h2>
            </div>
        </div>
    )
}