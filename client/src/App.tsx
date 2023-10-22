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
    const [seed, setSeed] = useState(1);
    const onFocus = () => {
        setSeed(Math.random);
        console.log("Tab is in focus");
    };
    useEffect(() => {
        window.addEventListener("focus", onFocus);
        return () => {
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <div className="">
                        <Starfield seed={seed} />
                        <LandingPage />
                        <NavBar />
                    </div>} />
                <Route path="/leaderboard/contrihub" element={
                    <div>
                        <Starfield seed={seed} />
                        <ContrihubLeaderboard />
                        <Events currentEvent="contrihub" />
                    </div>} />
                <Route path="/leaderboard/softablitz" element={
                    <div>
                        <Starfield seed={seed} />
                        <EventLeaderboard />
                        <Events currentEvent="softablitz" />
                    </div>
                } />
                <Route path="/leaderboard/webster" element={
                    <div>
                        <Starfield seed={seed} />
                        <EventLeaderboard />
                        <Events currentEvent="webster" />
                    </div>
                } />
                <Route path="/leaderboard/logicalrhythm" element={
                    <div>
                        <Starfield seed={seed} />
                        <EventLeaderboard />
                        <Events currentEvent="logicalrhythm" />
                    </div>
                } />
                <Route path="/leaderboard/droidrush" element={
                    <div>
                        <Starfield seed={seed} />
                        <EventLeaderboard />
                        <Events currentEvent="droidrush" />
                    </div>
                } />
            </Routes>
        </BrowserRouter >
    )
}

export default App;