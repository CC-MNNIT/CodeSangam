import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DropDown from "./Dropdown";
import BASE_URL from "../Utils/Config";
import { NavLink } from "react-router-dom";
import logo from "../Assets/cccover2copy.png";
// interface props {
//     isHome: boolean
// }

export default function NavBar() {
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [hide, setHide] = useState("none");
  // const [show, setShow] = useState(false);
  const navigate = useNavigate();
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    setLogoOpacity(currentScroll / 500);
  });
  return (
    <div>
      {/* <Starfield /> */}
      <nav
        style={{ zIndex: "40000000" }}
        className="bg-transparent fixed w-full top2 left-0"
      >
        <div className="flex flex-wrap items-center justify-between pt-0 p-4 mt-0 m-3">
          <NavLink
            to={`/${BASE_URL}`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
            }}
            className="flex h-full justify-center items-center md:order-1" // Add 'items-center' to vertically center the logo
          >
            <img src={logo} className=" h-[6rem] ml-2 pt-0 mt-0 mr-3" alt="" />
          </NavLink>
          <div className="flex justify-between md:order-2">
            <a
              href={`/${BASE_URL}/api/auth`}
              style={{ fontSize: "75%" }}
              type="button"
              className="card text-blue-500 event-selected border-2 rounded-t-lg inline-block p-4 md:hover:text-blue-500"
            >
              DASHBOARD
            </a>
            <button
              onClick={() => {
                hide == "block" ? setHide("none") : setHide("block");
              }}
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center border-2 ml-4 p-2 w-12 h-12 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          {/* for desktop view */}
          <div
            style={{}}
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          >
            <ul
              style={{ alignItems: "center" }}
              className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-black md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-transparent md:dark:bg-transparent dark:border-gray-700"
            >
              <li>
                <NavLink
                  to={`/${BASE_URL}`}
                  onClick={() => {
                    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
                  }}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  HOME
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${BASE_URL}`}
                  // onClick={() => {
                  //   window.scrollTo({
                  //     left: 0,
                  //     top: document.body.scrollHeight,
                  //     behavior: "smooth",
                  //   });
                    
                  // }}
                  onClick= {()=>{
                    const scrollToBottom =()=>{
                      window.scrollTo({
                        left: 0,
                        top: document.body.scrollHeight,
                        behavior: 'smooth',
                      });
                    };
                    scrollToBottom();
                    setTimeout(scrollToBottom, 100);
                  }}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  EVENTS
                </NavLink>
              </li>
              <li className="nav-desktop">
                <NavLink
                  to={`/${BASE_URL}/leaderboard/webster`}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  LEADERBOARDS
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${BASE_URL}/team`}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  TEAM
                </NavLink>
              </li>
            </ul>
          </div>
          {/* for mobile view */}
          <div
            style={{ display: hide }}
            className="items-center justify-between w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul
              style={{ alignItems: "center" }}
              className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-black md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-transparent md:dark:bg-transparent dark:border-gray-700"
            >
              <li>
                <NavLink
                  to={`/${BASE_URL}`}
                  onClick={() => {
                    setHide("none");
                    window.scrollTo({ left: 0, top: 0 });
                  }}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  HOME
                </NavLink>
              </li>
              <li className="nav-desktop">
                <NavLink
                  to={`/${BASE_URL}`}
                  onClick={() => {
                    setHide("none");
                    window.scrollTo({
                      left: 0,
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  EVENTS
                </NavLink>
              </li>
              <li className="nav-desktop">
                <NavLink
                  to={`${BASE_URL}/leaderboard/contrihub`}
                  onClick={() => {
                    setHide("none");
                    window.scrollTo({ left: 0, top: 0 });
                  }}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  LEADERBOARDS
                </NavLink>
              </li>
              <li className="nav-mobile">
                <NavLink
                  to={`/${BASE_URL}`}
                  onClick={() => {
                    setHide("none");
                    window.scrollTo({
                      left: 0,
                      top: document.body.scrollHeight * 0.25,
                      behavior: "smooth",
                    });
                  }}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  EVENTS
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${BASE_URL}/team`}
                  onClick={() => {
                    setHide("none");
                  }}
                  className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500"
                >
                  TEAM
                </NavLink>
              </li>

              <li className="nav-mobile">
                <div className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">
                  <DropDown setHide={setHide} />
                </div>
                {/* <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/webster`); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">WEBSTER RANKINGS</div> */}
              </li>
              {/* <li className='nav-mobile'>
                                <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/droidrush`); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">DROIDRUSH RANKINGS</div>
                            </li>
                            <li className='nav-mobile'>
                                <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/contrihub`); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">CONTRIHUB RANKINGS</div>
                            </li>
                            <li className='nav-mobile'>
                                <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/softablitz`); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">SOFTABLITZ RANKINGS</div>
                            </li>
                            <li className='nav-mobile'>
                                <div onClick={() => { setHide("none"); navigate(`/${BASE_URL}/leaderboard/logicalrhythm`); window.scrollTo({ left: 0, top: 0 }); }} className="card block cursor-pointer py-2 pl-3 pr-4 text-gray-900 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">LOGICAL RHYTHM RANKINGS</div>
                            </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
