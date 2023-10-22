import React from 'react'
import moonwith from "../Assets/moon.svg";
import { useNavigate } from "react-router-dom";


interface props {
    currentEvent: string
}

export default function Events({ currentEvent }: props) {
    const navigate = useNavigate();
    return (
        <nav style={{ marginTop: "50px" }} className="bg-transparent fixed w-full z-20 top-0 left-0">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 m-3">
                <div style={{ margin: "auto", width: "100vw" }} className="items-center justify-between hidden md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul style={{ margin: "auto", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "space-around", width: "100vw" }} className=" text-sm font-medium text-center text-gray-500  border-gray-200 dark:border-gray-700 dark:text-gray-400">
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate("/leaderboard/webster")} aria-current="page" className={`${currentEvent === "webster" ? " active dark:bg-gray-800" : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"} rounded-t-lg card inline-block p-4 md:dark:hover:text-blue-500`}>WEBSTER</a>
                        </li>
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate("/leaderboard/droidrush")} className={`${currentEvent === "droidrush" ? " active dark:bg-gray-800" : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"} rounded-t-lg card inline-block p-4 md:dark:hover:text-blue-500`}>DROIDRUSH</a>
                        </li>
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate("/leaderboard/logicalrhythm")} className={`${currentEvent === "logicalrhythm" ? " active dark:bg-gray-800" : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"} rounded-t-lg card inline-block p-4 md:dark:hover:text-blue-500`}>LOGICAL RHYTHM</a>
                        </li>
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate("/leaderboard/softablitz")} className={`${currentEvent === "softablitz" ? " active dark:bg-gray-800" : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"} rounded-t-lg card inline-block p-4 md:dark:hover:text-blue-500`}>SOFTABLITZ</a>
                        </li>
                        <li className="mr-2 cursor-pointer">
                            <a onClick={() => navigate("/leaderboard/contrihub")} className={`${currentEvent === "contrihub" ? " active dark:bg-gray-800" : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"} rounded-t-lg card inline-block p-4 md:dark:hover:text-blue-500`}>CONTRIHUB</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
