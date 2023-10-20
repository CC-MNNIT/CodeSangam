import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/LandingPage";
import Starfield from "./Components/Starfield";
import NavBar from "./Components/NavBar";
import Leaderboard from "./Components/Leaderboard";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div className=""><Starfield /><LandingPage /><NavBar /></div>} />
                <Route path="/leaderboard" element={<div><Starfield /><Leaderboard /></div>} />
            </Routes>
        </BrowserRouter >
    )
}

export default App;