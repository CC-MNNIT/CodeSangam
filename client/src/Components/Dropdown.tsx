import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


interface props {
    setHide: (p1: string) => any;
}

export default function DropDown({ setHide }: props) {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    // const [hide, setHide] = useState("none");
    return (
        <div>
            <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="inline-flex card cursor-pointer py pl-3 pr-4 ml-2 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500" type="button">RANKINGS<svg className="w-2.5 h-2.5 mt-2 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
            </svg>
            </button>

            <div id="dropdown" className="z-10 hidden bg-black divide-y divide-black rounded-lg shadow w-44">
                <ul style={{ alignItems: "center" }} className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 
                rounded-lg bg-black md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-transparent md:dark:bg-transparent dark:border-gray-700" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/webster`); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">WEBSTER</div>
                    </li>
                    <li>
                        <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/droidrush`); window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">DROIDRUSH</div>
                    </li>
                    <li>
                        <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/logicalrhythm`); window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" }); }} className="card block cursor-pointer py-2 pl-9 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">LOGICAL RHYTHM</div>
                    </li>
                    <li>
                        <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/softablitz`); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">SOFTABLITZ</div>
                    </li>
                    <li>
                        <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/contrihub`); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">CONTRIHUB</div>
                    </li>
                </ul>
            </div>

        </div>
    )
}
