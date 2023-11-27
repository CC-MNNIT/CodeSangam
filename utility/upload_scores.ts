import { readFileSync } from "fs";
import { Table, Tables, TeamScore } from "./models";
import { execSQL } from "./util";

async function loadScores(): Promise<Map<Table, TeamScore[]>> {
    return new Promise(async (resolve, reject) => {
        const scoreMap: Map<Table, TeamScore[]> = new Map();

        console.log("Loading scores...");
        for (let table of Tables) {
            readFileSync(`scores/${table}.csv`, { encoding: "utf-8" }).split("\n").forEach((line, i) => {
                if (i === 0) return;
                const [rTeamId, rScore] = line.split(",");
                if (rTeamId == undefined || rScore == undefined) return;

                const teamId = Number(rTeamId);
                const score = Number(rScore);
                scoreMap.set(table, [...scoreMap.get(table) || [], { teamId, score }])
            });
            console.log(table, (scoreMap.get(table) || []).length);
        }
        console.log("--\n");
        resolve(scoreMap);
    });
}

async function uploadScore(scoreMap: Map<Table, TeamScore[]>): Promise<Number> {
    return new Promise(async (resolve, reject) => {
        console.log("Uploading scores...");

        for (let table of Tables) {
            const teamScores = scoreMap.get(table) || [];
            for (let { teamId, score } of teamScores) {
                await execSQL(`update ${table} set score = ${score} where team_id = ${teamId}`);
            }
            console.log(table, teamScores.length);
        }
        resolve(scoreMap.size);
    });
}

const scoreMap: Map<Table, TeamScore[]> = await loadScores();
console.log('Completed ', await uploadScore(scoreMap));
