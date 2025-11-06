import React, { useState, useEffect } from "react";
import first from "../Assets/first.jpg";
import second from "../Assets/second.jpg";
import third from "../Assets/third.jpg";
import { Team } from "../Models/EventModel";

interface Prop {
  teams: Team[];
}

function getFirstName(name: string): string {
  const words: string[] = name.split(" ");
  return words[0];
}

function getLastName(name: string): string {
  const words: string[] = name.split(" ");
  return words.length > 1 ? words[words.length - 1] : "";
}

export default function EventsPodium({ teams }: Prop) {
  const [topDivOpacity, setTopDivOpacity] = useState(1);
  const firstTeam = teams[0];
  const secondTeam = teams[1];
  const thirdTeam = teams[2];

  window.addEventListener("scroll", () => {
    if (window.innerWidth > 850) {
      const currentScroll = window.scrollY;
      setTopDivOpacity(1 - currentScroll / 250);
    }
  });
  return (
    <div
      style={{
        width: "100vw",
        height: "fit-content",
        opacity: topDivOpacity,
        overflow: "hidden",
      }}
    >
      <div
        className="events-podium"
        style={{ position: "relative", width: "100vw", height: "fit-content" }}
      >
        <div
          className="events-podium-container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            className="container-events-podium container podium"
            style={{ transform: "translateY(25px)" }}
          >
            {secondTeam && secondTeam.members.length >= 2 ? (
              <div className="podium__item" style={{ zIndex: "90" }}>
                <div
                  style={{ height: "250px" }}
                  className="podium__rank second"
                >
                  <div className="loader2">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="image-cropper">
                    <img src={`${secondTeam.members[1].avatar}`} alt="" />
                  </div>
                </div>
                {/* <p className="podium__city">#2</p> */}
                <p className="podium__city">
                  {getFirstName(secondTeam.members[1].name)}
                </p>
                <p className="podium__city">
                  {getLastName(secondTeam.members[1].name)}
                </p>
                <p className="podium__city">{secondTeam.members[1].reg_no}</p>
              </div>
            ) : (
              <></>
            )}
            {secondTeam && secondTeam.members.length >= 1 ? (
              <div className="podium__item" style={{ zIndex: "190" }}>
                {secondTeam.members.length == 2 ? (
                  <div
                    style={{ height: "250px" }}
                    className="podium__rank first"
                  >
                    <div className="loader2">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="image-cropper">
                      <img src={`${secondTeam.members[0].avatar}`} alt="" />
                    </div>
                  </div>
                ) : (
                  <div className="podium__rank first">
                    <div className="loader2">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="image-cropper">
                      <img src={`${secondTeam.members[0].avatar}`} alt="" />
                    </div>
                  </div>
                )}

                {/* <p className="podium__city">#1</p> */}
                <p className="podium__city">
                  {getFirstName(secondTeam.members[0].name)}
                </p>
                <p className="podium__city">
                  {getLastName(secondTeam.members[0].name)}
                </p>
                <p className="podium__city">{secondTeam.members[0].reg_no}</p>
              </div>
            ) : (
              <></>
            )}
            {secondTeam && secondTeam.members.length >= 3 ? (
              <div className="podium__item" style={{ zIndex: "40" }}>
                <div style={{ height: "250px" }} className="podium__rank third">
                  <div className="loader2">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="image-cropper">
                    <img src={`${secondTeam.members[2].avatar}`} alt="" />
                  </div>
                </div>
                {/* <p className="podium__city">#3</p> */}
                <p className="podium__city">
                  {getFirstName(secondTeam.members[2].name)}
                </p>
                <p className="podium__city">
                  {getLastName(secondTeam.members[2].name)}
                </p>
                <p className="podium__city">{secondTeam.members[2].reg_no}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
          {secondTeam && <> <p style={{ color: "white" }}>#2</p>
          <p style={{ color: "white" }}>{secondTeam ? secondTeam.name : ""}</p>    
          </>}
        </div>
        <div
          className="events-podium-container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="container-events-podium container podium">
            {firstTeam && firstTeam.members.length >= 2 ? (
              <div className="podium__item" style={{ zIndex: "100" }}>
                <div
                  style={{ height: "250px" }}
                  className="podium__rank second"
                >
                  <div className="loader1">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="image-cropper">
                    <img src={`${firstTeam.members[1].avatar}`} alt="" />
                  </div>
                </div>
                {/* <p className="podium__city">#2</p> */}
                <p className="podium__city">
                  {getFirstName(firstTeam.members[1].name)}
                </p>
                <p className="podium__city">
                  {getLastName(firstTeam.members[1].name)}
                </p>
                <p className="podium__city">{firstTeam.members[1].reg_no}</p>
              </div>
            ) : (
              <></>
            )}
            {firstTeam && firstTeam.members.length >= 1 ? (
              <div className="podium__item" style={{ zIndex: "200" }}>
                {firstTeam.members.length == 2 ? (
                  <div
                    style={{ height: "250px" }}
                    className="podium__rank first"
                  >
                    <div className="loader1">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="image-cropper">
                      <img src={`${firstTeam.members[0].avatar}`} alt="" />
                    </div>
                  </div>
                ) : (
                  <div className="podium__rank first">
                    <div className="loader1">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="image-cropper">
                      <img src={`${firstTeam.members[0].avatar}`} alt="" />
                    </div>
                  </div>
                )}

                {/* <p className="podium__city">#1</p> */}
                <p className="podium__city">
                  {getFirstName(firstTeam.members[0].name)}
                </p>
                <p className="podium__city">
                  {getLastName(firstTeam.members[0].name)}
                </p>
                <p className="podium__city">{firstTeam.members[0].reg_no}</p>
              </div>
            ) : (
              <></>
            )}
            {firstTeam && firstTeam.members.length >= 3 ? (
              <div className="podium__item" style={{ zIndex: "50" }}>
                <div style={{ height: "250px" }} className="podium__rank third">
                  <div className="loader1">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="image-cropper">
                    <img src={`${firstTeam.members[2].avatar}`} alt="" />
                  </div>
                </div>
                {/* <p className="podium__city">#3</p> */}
                <p className="podium__city">
                  {getFirstName(firstTeam.members[2].name)}
                </p>
                <p className="podium__city">
                  {getLastName(firstTeam.members[2].name)}
                </p>
                <p className="podium__city">{firstTeam.members[2].reg_no}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
          <p style={{ color: "white" }}>#1</p>
          <p style={{ color: "white" }}>{firstTeam ? firstTeam.name : ""}</p>
        </div>
        {thirdTeam ? (
          <div
            className="events-podium-container"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              className="container-events-podium container podium"
              style={{ transform: "translateY(50px)" }}
            >
              {thirdTeam && thirdTeam.members.length >= 2 ? (
                <div className="podium__item" style={{ zIndex: "80" }}>
                  <div
                    style={{ height: "250px" }}
                    className="podium__rank second"
                  >
                    <div className="loader3">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="image-cropper">
                      <img src={`${thirdTeam.members[1].avatar}`} alt="" />
                    </div>
                  </div>
                  {/* <p className="podium__city">#2</p> */}
                  <p className="podium__city">
                    {getFirstName(thirdTeam.members[1].name)}
                  </p>
                  <p className="podium__city">
                    {getLastName(thirdTeam.members[1].name)}
                  </p>
                  <p className="podium__city">{thirdTeam.members[1].reg_no}</p>
                </div>
              ) : (
                <></>
              )}
              {thirdTeam && thirdTeam.members.length >= 1 ? (
                <div className="podium__item" style={{ zIndex: "180" }}>
                  {thirdTeam.members.length == 2 ? (
                    <div
                      style={{ height: "250px" }}
                      className="podium__rank third"
                    >
                      <div className="loader3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div className="image-cropper">
                        <img src={`${thirdTeam.members[0].avatar}`} alt="" />
                      </div>
                    </div>
                  ) : (
                    <div className="podium__rank first">
                      <div className="loader3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div className="image-cropper">
                        <img src={`${thirdTeam.members[0].avatar}`} alt="" />
                      </div>
                    </div>
                  )}
                  {/* <p className="podium__city">#1</p> */}
                  <p className="podium__city">
                    {getFirstName(thirdTeam.members[0].name)}
                  </p>
                  <p className="podium__city">
                    {getLastName(thirdTeam.members[0].name)}
                  </p>
                  <p className="podium__city">{thirdTeam.members[0].reg_no}</p>
                </div>
              ) : (
                <></>
              )}
              {thirdTeam.members.length >= 3 ? (
                <div className="podium__item" style={{ zIndex: "30" }}>
                  <div
                    style={{ height: "250px" }}
                    className="podium__rank third"
                  >
                    <div className="loader3">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="image-cropper">
                      <img src={`${thirdTeam.members[2].avatar}`} alt="" />
                    </div>
                  </div>
                  {/* <p className="podium__city">#3</p> */}
                  <p className="podium__city">
                    {getFirstName(thirdTeam.members[2].name)}
                  </p>
                  <p className="podium__city">
                    {getLastName(thirdTeam.members[2].name)}
                  </p>
                  <p className="podium__city">{thirdTeam.members[2].reg_no}</p>
                </div>
              ) : (
                <></>
              )}
            </div>
            <p style={{ color: "white" }}>#3</p>
            <p style={{ color: "white" }}>{thirdTeam.name}</p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div
        className="events-podium-line line"
        style={{
          position: "absolute",
          bottom: "0px",
          marginBottom: "50px",
          textAlign: "center",
          width: "100vw",
          textTransform: "uppercase",
        }}
      >
        <h2 className="lineUp">Scroll down to see complete Leaderboard</h2>
      </div>
    </div>
  );
}
