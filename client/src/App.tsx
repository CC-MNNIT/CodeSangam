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
import BASE_URL from "./Utils/Config";

function App() {
    return (
        <Routes>
            <Route path={`/${BASE_URL}`} element={
                <div className="">
                    <Starfield />
                    <LandingPage />
                    <NavBar isHome={true} />
                </div>} />
            <Route path={`${BASE_URL}/leaderboard`}>
                <Route path={`contrihub`} element={
                    <div>
                        <Starfield />
                        <ContrihubLeaderboard />
                        <NavBar isHome={false} />
                        <Events currentSelected="contrihub" />
                    </div>} />
                <Route path={`softablitz`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={softablitzRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="softablitz" />
                    </div>
                } />
                <Route path={`webster`} index element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={websterRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="webster" />
                    </div>
                } />
                <Route path={`logicalrhythm`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={logicalrhythmRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="logicalrhythm" />
                    </div>
                } />
                <Route path={`droidrush`} element={
                    <div>
                        <Starfield />
                        <EventLeaderboard currentAPI={droidrushRankingsDataAPI} />
                        <NavBar isHome={false} />
                        <Events currentSelected="droidrush" />
                    </div>
                } />
            </Route>
            <Route path={`${BASE_URL}/team`} element={
                <div className="">
                    <Starfield />
                    <Team />
                    <NavBar isHome={true} />
                </div>} />
        </Routes>
    )
}

export default App;