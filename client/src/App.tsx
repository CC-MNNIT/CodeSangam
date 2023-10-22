import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/LandingPage";
import Starfield from "./Components/Starfield";
import NavBar from "./Components/NavBar";
import Events from "./Components/Events";
import ContrihubLeaderboard from "./Components/ContrihubLeaderboard";
import EventLeaderboard from "./Components/EventLeaderboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <div className="">
                        <Starfield/>
                        <LandingPage />
                        <NavBar />
                    </div>} />
                <Route path="/leaderboard/contrihub" element={
                    <div>
                        <Starfield/>
                        <ContrihubLeaderboard />
                        <NavBar />
                        <Events currentEvent="contrihub" />
                    </div>} />
                <Route path="/leaderboard/softablitz" element={
                    <div>
                        <Starfield/>
                        <EventLeaderboard />
                        <NavBar />
                        <Events currentEvent="softablitz" />
                    </div>
                } />
                <Route path="/leaderboard/webster" element={
                    <div>
                        <Starfield/>
                        <EventLeaderboard />
                        <NavBar />
                        <Events currentEvent="webster" />
                    </div>
                } />
                <Route path="/leaderboard/logicalrhythm" element={
                    <div>
                        <Starfield/>
                        <EventLeaderboard />
                        <NavBar />
                        <Events currentEvent="logicalrhythm" />
                    </div>
                } />
                <Route path="/leaderboard/droidrush" element={
                    <div>
                        <Starfield/>
                        <EventLeaderboard />
                        <NavBar />
                        <Events currentEvent="droidrush" />
                    </div>
                } />
            </Routes>
        </BrowserRouter >
    )
}

export default App;