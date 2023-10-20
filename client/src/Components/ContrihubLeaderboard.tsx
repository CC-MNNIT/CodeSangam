import React from 'react';

export default function ContrihubLeaderboard() {
  const datas = [
    {
      rank: 1,
      username: "subrat",
      total_points: 100,
      bonus_points: 50,
      deducted_points: 0
    },
    {
      rank: 2,
      username: "abhishek",
      total_points: 50,
      bonus_points: 20,
      deducted_points: 10
    },
    {
      rank: 3,
      username: "amara",
      total_points: 10,
      bonus_points: 5,
      deducted_points: 20
    },
    {
      rank: 4,
      username: "nobita",
      total_points: 1,
      bonus_points: 0,
      deducted_points: 30
    },
    {
      rank: 5,
      username: "shizuka",
      total_points: 0,
      bonus_points: 0,
      deducted_points: 40
    }
  ];
  return (
    <div style={{marginTop: "80px",position: "fixed", backgroundColor: "rgba(0,0,0,0)", display: "flex", justifyContent: "center", width: "100vw", height: "100vh" }}>
      <div style={{width: "100vw"}}>
        <table>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Total Points</th>
            <th>Bonus Points</th>
            <th>Deducted Points</th>
          </tr>
          {datas.map((data) => {
            return (
              <tr>
                <td>{data.rank}</td>
                <td>{data.username}</td>
                <td>{data.total_points}</td>
                <td>{data.bonus_points}</td>
                <td>{data.deducted_points}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  )
}
