import React from "react";
import "./App.css";
import LandingPage from "./Components/LandingPage";
import Starfield from "./Components/Starfield";
import NavBar from "./Components/NavBar";

function App() {
    return (
        <div className="">
            <Starfield />
            <LandingPage />
            <NavBar />
        </div>
    );
}

export default App;
