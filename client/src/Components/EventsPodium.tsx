import React, { useState, useEffect } from 'react';
import first from "../Assets/first.jpg";
import second from "../Assets/second.jpg";
import third from "../Assets/third.jpg";


export default function EventsPodium() {
    const [topDivOpacity, setTopDivOpacity] = useState(1);
    const firstTeam = {
        members: [
            {
                avatar: "string1",
                email: "string1",
                name: "string1",
                reg_no: "string1"
            },
            {
                avatar: "string2",
                email: "string2",
                name: "string2",
                reg_no: "string2"
            },
            {
                avatar: "string3",
                email: "string3",
                name: "string3",
                reg_no: "string3"
            }
        ],
        name: "Team 1",
        score: 1,
        size: 2,
        team_id: 3
    };
    const secondTeam = {
        members: [
            {
                avatar: "string1",
                email: "string1",
                name: "string1",
                reg_no: "string1"
            },
            {
                avatar: "string2",
                email: "string2",
                name: "string2",
                reg_no: "string2"
            },
            {
                avatar: "string3",
                email: "string3",
                name: "string3",
                reg_no: "string3"
            }
        ],
        name: "Team 2",
        score: 1,
        size: 2,
        team_id: 3
    };
    const thirdTeam = {
        members: [
            {
                avatar: "string1",
                email: "string1",
                name: "string1",
                reg_no: "string1"
            },
            {
                avatar: "string2",
                email: "string2",
                name: "string2",
                reg_no: "string2"
            },
            {
                avatar: "string3",
                email: "string3",
                name: "string3",
                reg_no: "string3"
            }
        ],
        name: "Team 3",
        score: 1,
        size: 2,
        team_id: 3
    };
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        setTopDivOpacity(1 - currentScroll / 250);
    });
    return (

        <div style={{ width: "100vw", height: "fit-content", opacity: topDivOpacity, overflow: "hidden" }}>
            <div className='events-podium' style={{ position: "relative", width: "100vw", height: "fit-content" }}>
                <div className='events-podium-container' style={{ display: "flex", flexDirection: "column" }}>
                    <div className="container-events-podium container podium" style={{ transform: "translateY(25px)" }}>
                        {
                            (secondTeam.members.length >= 2) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "90" }}>
                                        <div className="podium__rank second">
                                            <div className="loader2">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${secondTeam.members[1].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#2</p> */}
                                        <p className="podium__city">{secondTeam.members[1].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                        {
                            (secondTeam.members.length >= 1) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "190" }}>
                                        <div className="podium__rank first">
                                            <div className="loader1">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${secondTeam.members[0].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#1</p> */}
                                        <p className="podium__city">{secondTeam.members[0].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                        {
                            (secondTeam.members.length >= 3) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "40" }}>
                                        <div className="podium__rank third">
                                            <div className="loader3">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${secondTeam.members[2].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#3</p> */}
                                        <p className="podium__city">{secondTeam.members[2].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                    </div>
                    <p style={{ color: "white" }}>#2</p>
                    <p style={{ color: "white" }}>{secondTeam.name}</p>
                </div>
                <div className='events-podium-container' style={{ display: "flex", flexDirection: "column" }}>
                    <div className="container-events-podium container podium">
                        {
                            (firstTeam.members.length >= 2) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "100" }}>
                                        <div className="podium__rank second">
                                            <div className="loader2">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${firstTeam.members[1].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#2</p> */}
                                        <p className="podium__city">{firstTeam.members[1].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                        {
                            (firstTeam.members.length >= 1) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "200" }}>
                                        <div className="podium__rank first">
                                            <div className="loader1">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${firstTeam.members[0].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#1</p> */}
                                        <p className="podium__city">{firstTeam.members[0].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                        {
                            (firstTeam.members.length >= 3) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "50" }}>
                                        <div className="podium__rank third">
                                            <div className="loader3">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${firstTeam.members[2].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#3</p> */}
                                        <p className="podium__city">{firstTeam.members[2].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                    </div>
                    <p style={{ color: "white" }}>#1</p>
                    <p style={{ color: "white" }}>{firstTeam.name}</p>
                </div>
                <div className='events-podium-container' style={{ display: "flex", flexDirection: "column" }}>
                    <div className="container-events-podium container podium" style={{ transform: "translateY(50px)" }}>
                        {
                            (thirdTeam.members.length >= 2) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "80" }}>
                                        <div className="podium__rank second">
                                            <div className="loader2">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${thirdTeam.members[1].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#2</p> */}
                                        <p className="podium__city">{thirdTeam.members[1].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                        {
                            (thirdTeam.members.length >= 1) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "180" }}>
                                        <div className="podium__rank first">
                                            <div className="loader1">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${thirdTeam.members[0].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#1</p> */}
                                        <p className="podium__city">{thirdTeam.members[0].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                        {
                            (thirdTeam.members.length >= 3) ?
                                (
                                    <div className="podium__item" style={{ zIndex: "30" }}>
                                        <div className="podium__rank third">
                                            <div className="loader3">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className='image-cropper'>
                                                <img src={`https://github.com/${thirdTeam.members[2].name}.png`} alt="" />
                                            </div>
                                        </div>
                                        {/* <p className="podium__city">#3</p> */}
                                        <p className="podium__city">{thirdTeam.members[2].name}</p>
                                    </div>
                                )
                                :
                                (<></>)
                        }
                    </div>
                    <p style={{ color: "white" }}>#3</p>
                    <p style={{ color: "white" }}>{thirdTeam.name}</p>
                </div>
            </div>
            <div className='events-podium-line line' style={{ position: "absolute", bottom: "0px", marginBottom: "50px", textAlign: 'center', width: "100vw", textTransform: "uppercase" }}>
                <h2 className='lineUp'>Scroll down to see complete Leaderboard</h2>
            </div>
        </div>
    )
}