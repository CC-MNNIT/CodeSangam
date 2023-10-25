import React, { useState } from 'react'
import moonwith from "../Assets/moon.svg";
import { useNavigate } from "react-router-dom";

interface props {
    isHome: boolean
}

export default function NavBar({ isHome }: props) {
    const [logoOpacity, setLogoOpacity] = useState(0);
    const navigate = useNavigate();
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        setLogoOpacity(currentScroll / 500);
    });
    return (
        <div>
            <nav style={{ zIndex: "5000000" }} className="bg-transparent fixed w-full top-0 left-0">
                <div className="flex flex-wrap items-center justify-between p-4 m-3">
                    <div style={isHome == true ? { opacity: logoOpacity } : {}} onClick={() => window.scrollTo({ left: 0, top: 0, behavior: "smooth" })} className="flex cursor-pointer items-center">
                        <div className='card self-center text-2xl font-semibold whitespace-nowrap dark:text-white flex'>C<img src={moonwith} className="h-7" alt="logo" />DESANGAM</div>
                    </div>
                    <div className="flex md:order-2">
                        <button type="button" className="card borderxyz bg-transparent border-2 border-spacing-3 sm:pb-0 block cursor-pointer text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-1 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent sm:p-2 lg:inline">LOGIN</button>
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div style={{ marginRight: "100px" }} className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-transparent md:dark:bg-transparent dark:border-gray-700">
                            <li>
                                <div onClick={() => { navigate("/"); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">HOME</div>
                            </li>
                            <li>
                                <div onClick={() => { navigate("/"); window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">EVENTS</div>
                            </li>
                            <li className='nav-desktop'>
                                <div onClick={() => { navigate("/leaderboard/contrihub"); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">LEADERBOARDS</div>
                            </li>
                            <li>
                                <div onClick={() => navigate("/")} className="card block cursor-pointer py-2 pl-3 pr-4  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">TEAM</div>
                            </li>
                            <li className='nav-mobile'>
                                <div onClick={() => { navigate("/leaderboard/webster"); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">WEBSTER RANKINGS</div>
                            </li>
                            <li className='nav-mobile'>
                                <div onClick={() => { navigate("/leaderboard/droidrush"); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">DROIDRUSH RANKINGS</div>
                            </li>
                            <li className='nav-mobile'>
                                <div onClick={() => { navigate("/leaderboard/contrihub"); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">CONTRIHUB RANKINGS</div>
                            </li>
                            <li className='nav-mobile'>
                                <div onClick={() => { navigate("/leaderboard/softablitz"); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">SOFTABLITZ RANKINGS</div>
                            </li>
                            <li className='nav-mobile'>
                                <div onClick={() => { navigate("/leaderboard/logicalrhythm"); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">LOGICAL RHYTHM RANKINGS</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}