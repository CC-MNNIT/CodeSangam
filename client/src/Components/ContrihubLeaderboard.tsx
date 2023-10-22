import React, { useState, useEffect } from 'react';
import axios from "axios";
import { rankingsDataAPI } from '../Utils/APIRoutes';
import Podium from "./Podium";

export default function ContrihubLeaderboard() {
  const [rankingsData, setRankingsData] = useState([
    {
      rank: 1,
      username: "Nobita",
      total_points: 100,
      bonus_points: 50,
      deducted_points: 0
    },
    {
      rank: 2,
      username: "Shizuka",
      total_points: 50,
      bonus_points: 20,
      deducted_points: 10
    },
    {
      rank: 3,
      username: "Suneo",
      total_points: 10,
      bonus_points: 5,
      deducted_points: 20
    },
    {
      rank: 4,
      username: "Subrat",
      total_points: 1,
      bonus_points: 0,
      deducted_points: 30
    },
    {
      rank: 5,
      username: "Amara",
      total_points: 34,
      bonus_points: 24,
      deducted_points: 40
    },
    {
      rank: 6,
      username: "Chis",
      total_points: 10,
      bonus_points: 2,
      deducted_points: 350
    },
    {
      rank: 7,
      username: "Luna",
      total_points: 12,
      bonus_points: 35,
      deducted_points: 70
    },
    {
      rank: 8,
      username: "Tokyo",
      total_points: 56,
      bonus_points: 23,
      deducted_points: 90
    },
    {
      rank: 9,
      username: "Pijaku",
      total_points: 12,
      bonus_points: 88,
      deducted_points: 90
    },
    {
      rank: 10,
      username: "Ramesh",
      total_points: 23,
      bonus_points: 88,
      deducted_points: 0
    },
    {
      rank: 11,
      username: "Suresh",
      total_points: 44,
      bonus_points: 34,
      deducted_points: 120
    },
    {
      rank: 12,
      username: "Pankaj",
      total_points: 70,
      bonus_points: 7,
      deducted_points: 1
    },
    {
      rank: 13,
      username: "Lisa",
      total_points: 23,
      bonus_points: 11,
      deducted_points: 120
    }
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(rankingsDataAPI);
        console.log(data);
      } catch (err) {
        console.log(err);
      }

    }
    fetchData();
  }, []);
  return (
    <div>
      <Podium firstStudentName={rankingsData[0].username} secondStudentName={rankingsData[1].username} thirdStudentName={rankingsData[2].username} />
      <div style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "130px", position: "relative", backgroundColor: "rgba(0,0,0,0)", display: "flex", justifyContent: "center", width: "100vw", height: "100vh" }}>
        <div style={{}} className="relative overflow-x-auto shadow-md sm:rounded-lg w-screen">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead style={{ backdropFilter: "blur(30px)" }} className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50/[.7] dark:bg-gray-700/[.7] dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4 text-center">
                  Username
                </th>
                <th scope="col" className="px-6 py-4 text-center">
                  Bonus Points
                </th>
                <th scope="col" className="px-6 py-4 text-center">
                  Deducted Points
                </th>
                <th scope="col" className="px-6 py-4 text-center">
                  Total Points
                </th>
                <th scope="col" className="px-6 py-4 text-center">
                  Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {rankingsData.map((rankingData) => {
                return (
                  <tr className="bg-white border-b dark:bg-gray-900/[.7] dark:border-gray-700/[.7]">
                    <th scope="row" className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {rankingData.username}
                    </th>
                    <td className="px-6 py-4 text-center">
                      {rankingData.bonus_points}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {rankingData.deducted_points}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {rankingData.deducted_points}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-blue-600">
                      {rankingData.rank}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
