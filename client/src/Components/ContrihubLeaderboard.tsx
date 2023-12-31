import React, { useState, useEffect } from 'react';
import axios from "axios";
import { contrihubRankingsDataAPI } from '../Utils/APIRoutes';
import Podium from "./Podium";
import { Ranking } from '../Models/ContrihubModel';
import first from "../Assets/first.svg";
import second from "../Assets/second.svg";
import third from "../Assets/third.svg";


export default function ContrihubLeaderboard() {
  const [isListRecieved, setIsListRecieved] = useState(false);
  const [rankingsData, setRankingsData] = useState<Ranking[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(contrihubRankingsDataAPI);
        if (data != null && data.length >= 3) {
          setRankingsData(data);
          setIsListRecieved(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);
  
  return (
    <div>
      {(isListRecieved == false) ?
        (
          <div style={{ position: "relative", color: "wheat", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h1 style={{ marginTop: "80px", cursor: "default" }} className="card text-blue-500 event-selected border-2 rounded-t-lg inline-block p-2">RESULTS ARE NOT OUT YET</h1>
          </div>
        )
        :
        (
          <div>
            <Podium first={rankingsData[0]} second={rankingsData[1]} third={rankingsData[2]} />
            <div className='leaderboard-contaier' style={{ paddingLeft: "20px", paddingRight: "20px", position: "relative", backgroundColor: "rgba(0,234,0,0)", display: "flex", justifyContent: "center", width: "100vw", height: "100vh" }}>
              <div style={{ marginTop: "33px" }} className="relative overflow-x-auto shadow-md sm:rounded-lg w-screen">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead style={{ backdropFilter: "blur(30px)", zIndex: "1" }} className="sticky top-0 text-xs uppercase bg-gray-700/[.7] text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-center">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Reg No
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Bonus Points
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Total Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingsData.map((rankingData, i) => {
                      return (
                        <tr style={{ height: "35px" }} className="border-b bg-gray-900/[.7] border-gray-700/[.7]">
                          <td style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="px-6 py-4 text-center font-medium text-blue-600">
                            <div style={i + 1 == 1 ? {} : { display: "none" }} className="flex flex-col justify-center relative h-full min-w-[35px] max-w-[35px] min-h-[35px] max-h-[35px] rounded-full shadow-dark-level1 q3MuO">
                              <div style={{ position: "absolute", width: "35px", height: "35px" }} className="loaderlb1">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                              <h1 style={{ transform: "translateY(2px)" }} className='card'>1</h1>
                              <div className="z-base-1 absolute -top-2 right-[calc(50%_-_10px)]"><img style={{ scale: "80%" }} src={first} alt="Crown" />
                              </div>
                            </div>
                            <div style={i + 1 == 2 ? {} : { display: "none" }} className="flex flex-col justify-center relative h-full min-w-[35px] max-w-[35px] min-h-[35px] max-h-[35px] rounded-full shadow-dark-level1 q3MuO">
                              <div style={{ position: "absolute", width: "35px", height: "35px" }} className="loaderlb2">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                              <h1 style={{ transform: "translateY(2px)" }} className='card'>2</h1>
                              <div className="z-base-1 absolute -top-2 right-[calc(50%_-_10px)]"><img style={{ scale: "80%" }} src={second} alt="Crown" />
                              </div>
                            </div>
                            <div style={i + 1 == 3 ? {} : { display: "none" }} className="flex flex-col justify-center relative h-full min-w-[35px] max-w-[35px] min-h-[35px] max-h-[35px] rounded-full shadow-dark-level1 q3MuO">
                              <div style={{ position: "absolute", width: "35px", height: "35px" }} className="loaderlb3">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                              <h1 style={{ transform: "translateY(2px)" }} className='card'>3</h1>
                              <div className="z-base-1 absolute -top-2 right-[calc(50%_-_10px)]"><img style={{ scale: "80%" }} src={third} alt="Crown" />
                              </div>
                            </div>
                            <div style={i + 1 == 1 || i + 1 == 2 || i + 1 == 3 ? { display: "none" } : {}} className='card min-w-[35px] max-w-[35px] min-h-[35px] max-h-[35px] flex flex-col justify-center'>
                              {i + 1}
                            </div>
                          </td>
                          <th scope="row" className="text-center px-6 py-4 font-medium whitespace-nowrap text-white">
                            {rankingData.user_name}
                          </th>
                          <td className="px-6 py-4 text-center">
                            {rankingData.reg_no}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {rankingData.bonus_points}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {rankingData.total_points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}