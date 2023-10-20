import React from 'react'
import moonwith from "../Assets/moon.svg";
import { useNavigate } from "react-router-dom";

export default function Events() {
    const navigate = useNavigate();
    return (
        <div>
            <nav className="bg-transparent fixed w-full z-20 top-0 left-0">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 m-3">
                    <div onClick={() => navigate("/")} className="flex cursor-pointer items-center">
                        <div className='card self-center text-2xl font-semibold whitespace-nowrap dark:text-white flex'>C<img src={moonwith} className="h-7" alt="logo" />DESANGAM</div>
                    </div>
                    <div style={{ margin: "auto" }} className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col  p-4 md:p-0 mt-10 font-medium border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-transparent md:dark:bg-transparent dark:border-gray-700">
                            <li>
                                <a onClick={() => navigate("/")} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">HOME</a>
                            </li>
                            <li>
                                <a onClick={() => navigate("/eventleaderboard")} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">WEBSTER</a>
                            </li>
                            <li>
                                <a onClick={() => navigate("/eventleaderboard")} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">DROIDRUSH</a>
                            </li>
                            <li>
                                <a onClick={() => navigate("/eventleaderboard")} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">LOGICAL RHYTHM</a>
                            </li>
                            <li>
                                <a onClick={() => navigate("/eventleaderboard")} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">SOFTABLITZ</a>
                            </li>
                            <li>
                                <a onClick={() => navigate("/contrihubleaderboard")} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">CONTRIHUB</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
