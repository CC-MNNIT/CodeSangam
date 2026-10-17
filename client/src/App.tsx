import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Team from "./Components/Team";
import NavBar from "./Components/NavBar";
import Events from "./Components/Events";
import ContrihubLeaderboard from "./Components/ContrihubLeaderboard";
import EventLeaderboard from "./Components/EventLeaderboard";
import { websterRankingsDataAPI, droidrushRankingsDataAPI, logicalrhythmRankingsDataAPI, softablitzRankingsDataAPI } from './Utils/APIRoutes';
import { route } from "./Utils/Config";
import ErrorPage from "./Components/ErrorPage";
import Backdrop from "./ui/Backdrop";

/** Each part of the site is a different universe with its own colour. */
function universeTint(pathname: string): string {
    if (pathname.includes("/leaderboard")) return "244 63 94"; // Hall of Records — scarlet
    if (pathname.endsWith("/team")) return "139 92 246"; // Masters of the Mystic Arts — arcane
    if (pathname.replace(/\/+$/, "") === route().replace(/\/+$/, "")) return "255 143 31"; // Sanctum — sling gold
    return "148 163 184"; // The Void
}

/** New page, new universe: start at the top unless the nav asked for a scene. */
function ScrollToTop() {
    const { pathname, state } = useLocation();
    useEffect(() => {
        if (state?.scrollTo) return;
        window.scrollTo({ top: 0, left: 0 });
    }, [pathname, state]);
    return null;
}

function App() {
    const location = useLocation();
    const { pathname } = location;

    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://apply.devfolio.co/v2/sdk.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <div style={{ ["--tint" as string]: universeTint(pathname) } as React.CSSProperties}>
            <Backdrop />
            <NavBar />
            <ScrollToTop />
            <div key={pathname.startsWith(route("leaderboard")) ? "leaderboard" : pathname} className="motion-safe:animate-page-in">
            <Routes location={location}>
                <Route path={route()} element={<LandingPage />} />
                <Route path={route("leaderboard")}>
                    <Route path={`contrihub`} element={
                        <div>
                            <ContrihubLeaderboard />
                            <Events currentSelected="contrihub" />
                        </div>} />
                    <Route path={`softablitz`} element={
                        <div>
                            <EventLeaderboard currentAPI={softablitzRankingsDataAPI} />
                            <Events currentSelected="softablitz" />
                        </div>
                    } />
                    <Route path={`webster`} index element={
                        <div>
                            <EventLeaderboard currentAPI={websterRankingsDataAPI} />
                            <Events currentSelected="webster" />
                        </div>
                    } />
                    <Route path={`logicalrhythm`} element={
                        <div>
                            <EventLeaderboard currentAPI={logicalrhythmRankingsDataAPI} />
                            <Events currentSelected="logicalrhythm" />
                        </div>
                    } />
                    <Route path={`droidrush`} element={
                        <div>
                            <EventLeaderboard currentAPI={droidrushRankingsDataAPI} />
                            <Events currentSelected="droidrush" />
                        </div>
                    } />
                </Route>
                <Route path={route("team")} element={<Team />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
            </div>
        </div>
    )
}

export default App;
