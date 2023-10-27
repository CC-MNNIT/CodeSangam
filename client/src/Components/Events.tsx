import React from 'react'
import moonwith from "../Assets/moon.svg";
import { useNavigate } from "react-router-dom";


interface props {
    currentSelected: string
}

export default function Events({ currentSelected }: props) {
    const navigate = useNavigate();
    return (
        <nav style={{zIndex: "50000000", marginTop: "80px" }} className="nav-desktop bg-transparent fixed w-full z-20 top-0 left-0">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4 m-3">
                <div style={{ margin: "auto", width: "100vw" }} className="items-center justify-between md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul style={{ margin: "auto", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "space-around", width: "100vw" }} className=" text-sm font-medium text-center text-gray-500  border-gray-200 dark:border-gray-700 dark:text-gray-400">
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate(`/${process.env.REACT_APP_BASE_URL}/leaderboard/webster`)} aria-current="page" className={`${currentSelected === "webster" ? "text-blue-500 event-selected border-2" : "event-normal border-2 border-transparent"} rounded-t-lg inline-block p-3 hover:text-blue-500`}>WEBSTER</a>
                        </li>
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate(`/${process.env.REACT_APP_BASE_URL}/leaderboard/droidrush`)} className={`${currentSelected === "droidrush" ? "text-blue-500 event-selected border-2" : "event-normal border-2 border-transparent"} rounded-t-lg inline-block p-3 hover:text-blue-500`}>DROIDRUSH</a>
                        </li>
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate(`/${process.env.REACT_APP_BASE_URL}/leaderboard/logicalrhythm`)} className={`${currentSelected === "logicalrhythm" ? "text-blue-500 event-selected border-2" : "event-normal border-2 border-transparent"} rounded-t-lg inline-block p-3 hover:text-blue-500`}>LOGICAL RHYTHM</a>
                        </li>
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate(`/${process.env.REACT_APP_BASE_URL}/leaderboard/softablitz`)} className={`${currentSelected === "softablitz" ? "text-blue-500 event-selected border-2" : "event-normal border-2 border-transparent"} rounded-t-lg inline-block p-3 hover:text-blue-500`}>SOFTABLITZ</a>
                        </li>
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate(`/${process.env.REACT_APP_BASE_URL}/leaderboard/contrihub`)} className={`${currentSelected === "contrihub" ? "text-blue-500 event-selected border-2" : "event-normal border-2 border-transparent"} rounded-t-lg inline-block p-3 hover:text-blue-500`}>CONTRIHUB</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
