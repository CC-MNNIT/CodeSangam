import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/LandingPage";
import Starfield from "./Components/Starfield";
import NavBar from "./Components/NavBar";
import ContrihubLeaderboard from "./Components/ContrihubLeaderboard";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div className=""><Starfield /><LandingPage /><NavBar /></div>} />
                <Route path="/contrihubleaderboard" element={<div><Starfield /><ContrihubLeaderboard /></div>} />
            </Routes>
        </BrowserRouter >
    )
}

export default App;