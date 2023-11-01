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
    return (
        <BrowserRouter>
            <Routes>
                <Route path={`/`} element={
                    <div className="">
                        <Starfield />
                        <LandingPage />
                        <NavBar isHome={true} />
                    </div>} />
                <Route path={`/leaderboard/contrihub`} element={
                    <div>
                        <Starfield />
                        <ContrihubLeaderboard />
                        <NavBar isHome={false} />
                        <Events currentSelected="contrihub" />
                    </div>} />
                <Route path={`/leaderboard/softablitz`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={softablitzRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="softablitz" />
                    </div>
                } />
                <Route path={`/leaderboard/webster`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={websterRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="webster" />
                    </div>
                } />
                <Route path={`/leaderboard/logicalrhythm`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={logicalrhythmRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="logicalrhythm" />
                    </div>
                } />
                <Route path={`/leaderboard/droidrush`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={droidrushRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="droidrush" />
                    </div>
                } />
                <Route path={`/team`} element={
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