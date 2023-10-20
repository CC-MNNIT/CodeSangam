import React from 'react';

export default function ContrihubLeaderboard() {
  const datas = [
    {
      team_name: "Drama",
      team_leader: "subrat",
      team_member: 3,
      score: 50,
      position: 1
    },
    {
      team_name: "Not Usual",
      team_leader: "abhishek",
      team_member: 3,
      score: 10,
      position: 2
    },
    {
      team_name: "Unique",
      team_leader: "sinchan",
      team_member: 4,
      score: 5,
      position: 3
    }
  ];
  return (
    <div style={{marginTop: "80px", position: "fixed", backgroundColor: "rgba(0,0,0,0)", display: "flex", justifyContent: "center", width: "100vw", height: "100vh" }}>
      <div style={{width: "100vw"}}>
        <table>
          <tr>
            <th>Team Name</th>
            <th>Team Leader</th>
            <th>Team Member</th>
            <th>Score</th>
            <th>Position</th>
          </tr>
          {datas.map((data) => {
            return (
              <tr>
                <td>{data.team_name}</td>
                <td>{data.team_leader}</td>
                <td>{data.team_member}</td>
                <td>{data.score}</td>
                <td>{data.position}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  )
}
