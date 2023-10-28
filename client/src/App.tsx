import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/LandingPage";
import Team from "./Components/Team";
import Starfield from "./Components/Starfield";
import NavBar from "./Components/NavBar";
import Events from "./Components/Events";
import ContrihubLeaderboard from "./Components/ContrihubLeaderboard";
import EventLeaderboard from "./Components/EventLeaderboard";
import { websterRankingsDataAPI, droidrushRankingsDataAPI, logicalrhythmRankingsDataAPI, softablitzRankingsDataAPI } from './Utils/APIRoutes';

function App() {
    console.log(`${process.env.REACT_APP_BASE_URL}leaderboard/contrihub`);
    return (
        <BrowserRouter>
            <Routes>
                <Route path={process.env.REACT_APP_BASE_URL} element={
                    <div className="">
                        <Starfield />
                        <LandingPage />
                        <NavBar isHome={true} />
                    </div>} />
                <Route path={`${process.env.REACT_APP_BASE_URL}/leaderboard/contrihub`} element={
                    <div>
                        <Starfield />
                        <ContrihubLeaderboard />
                        <NavBar isHome={false} />
                        <Events currentSelected="contrihub" />
                    </div>} />
                <Route path={`${process.env.REACT_APP_BASE_URL}/leaderboard/softablitz`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={softablitzRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="softablitz" />
                    </div>
                } />
                <Route path={`${process.env.REACT_APP_BASE_URL}/leaderboard/webster`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={websterRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="webster" />
                    </div>
                } />
                <Route path={`${process.env.REACT_APP_BASE_URL}/leaderboard/logicalrhythm`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={logicalrhythmRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="logicalrhythm" />
                    </div>
                } />
                <Route path={`${process.env.REACT_APP_BASE_URL}/leaderboard/droidrush`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={droidrushRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="droidrush" />
                    </div>
                } />
                <Route path={`${process.env.REACT_APP_BASE_URL}/team`} element={
                    <div className="">
                        <Starfield />
                        <Team />
                        <NavBar isHome={true} />
                    </div>} />
            </Routes>
        </BrowserRouter >
    )
}

export default App;