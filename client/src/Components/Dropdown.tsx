import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../Utils/Config';
import { NavLink } from 'react-router-dom';


interface props {
    setHide: (p1: string) => any;
}

export default function DropDown({ setHide }: props) {
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
                        <NavLink to={`/${BASE_URL}/leaderboard/webster`} onClick={() => { setHide("none"); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">WEBSTER</NavLink>
                    </li>
                    <li>
                        <NavLink to={`/${BASE_URL}/leaderboard/droidrush`} onClick={() => { setHide("none"); window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">DROIDRUSH</NavLink>
                    </li>
                    <li>
                        <NavLink to={`/${BASE_URL}/leaderboard/logicalrhythm`} onClick={() => { setHide("none"); window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" }); }} className="card block cursor-pointer py-2 pl-9 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">LOGICAL RHYTHM</NavLink>
                    </li>
                    <li>
                        <NavLink to={`/${BASE_URL}/leaderboard/softablitz`} onClick={() => { setHide("none"); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">SOFTABLITZ</NavLink>
                    </li>
                    <li>
                        <NavLink to={`/${BASE_URL}/leaderboard/contrihub`} onClick={() => { setHide("none"); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">CONTRIHUB</NavLink>
                    </li>
                </ul>
            </div>

        </div>
    )
}
