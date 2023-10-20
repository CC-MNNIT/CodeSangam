import React from "react";
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
                        <Starfield />
                        <LandingPage />
                        <NavBar />
                    </div>} />
                <Route path="/contrihubleaderboard" element={
                    <div>
                        <Starfield />
                        <ContrihubLeaderboard />
                        <Events />
                    </div>} />
                <Route path="/eventleaderboard" element={
                    <div>
                        <Starfield />
                        <EventLeaderboard />
                        <Events />
                    </div>
                } />
            </Routes>
        </BrowserRouter >
    )
}

export default App;