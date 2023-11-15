import { XMLParser, XMLValidator } from "fast-xml-parser";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { Member, Table, Tables, Team } from "./models";
import { execSQL } from "./util";

const parser = new XMLParser();

async function parseAbstractSubmittedTeamIds(): Promise<Map<Table, number[]>> {
    return new Promise(async (resolve, reject) => {
        console.log(`|= Loading abstracts =|`);
        const xmlContents: string[] = [];

        for (let i = 0; i < Tables.length - 1; i++) {
            let table = Tables[i];
            console.log(`${table}`);
            let out = await execSQL(`select t.id from (select t.id from abstract a inner join team t on a.team_id = t.id) t inner join ${table} e on t.id = e.team_id`);
            xmlContents.push(out);
        }
        console.log('-')

        const abstractIds: Map<Table, number[]> = new Map();
        let absCount = 0;
        for (let i = 0; i < Tables.length - 1; i++) {
            console.log(`${Tables[i]} valid:`, XMLValidator.validate(xmlContents[i]));

            const { resultset } = parser.parse(xmlContents[i]);
            const { row } = resultset;
            const teamIds: number[] = [];
            for (let r = 0; r < row.length; r++) {
                const { field } = row[r];
                teamIds.push(Number(field));
            }
            console.log(teamIds.length);
            absCount += teamIds.length;

            abstractIds.set(Tables[i], teamIds);
            console.log('-')
        }
        console.log(`Total Abstracts: ${absCount}`);
        console.log(`|=====================|\n`);
        resolve(abstractIds);
    });
}

async function parseMembers(): Promise<Map<number, Member>> {
    return new Promise(async (resolve, reject) => {
        console.log(`|= Loading members =|`);
        const xmlContents = await execSQL(`select uid, name, registration_no from user`);

        const members: Map<number, Member> = new Map();
        console.log(`valid:`, XMLValidator.validate(xmlContents));

        const { resultset } = parser.parse(xmlContents);
        const { row } = resultset;
        for (let r = 0; r < row.length; r++) {
            const { field } = row[r];

            members.set(Number(field[0]), {
                name: String(field[1]),
                regNo: String(field[2]),
                phone: "",
            });
        }
        console.log(`|===================|\n`);
        resolve(members);
    });
}

async function parseParticipation(members: Map<number, Member>, abstractIds: Map<Table, number[]>): Promise<Map<Table, Team[]>> {
    return new Promise(async (resolve, reject) => {
        const xmlContents: string[] = [];
        console.log(`|= Loading teams =|`);

        for (let i = 0; i < Tables.length; i++) {
            let table = Tables[i];
            console.log(`loading teams ${table}`);
            let out = await execSQL(`select id, team.name, leader_id, m_id1, m_id2 from team inner join ${table} on team.id=${table}.team_id`);
            xmlContents.push(out);
        }
        console.log('-')

        const teams: Map<Table, Team[]> = new Map();
        for (let i = 0; i < Tables.length; i++) {
            let table = Tables[i];
            console.log(`${table} valid:`, XMLValidator.validate(xmlContents[i]));

            const { resultset } = parser.parse(xmlContents[i]);
            const { row } = resultset;
            for (let r = 0; r < row.length; r++) {
                const { field } = row[r];

                teams.set(table, [...teams.get(table) || [], {
                    id: Number(field[0]),
                    name: String(field[1]),
                    members: [
                        members.get(Number(field[2])),
                        members.get(Number(field[3])),
                        members.get(Number(field[4]))
                    ].filter(m => m !== undefined) as Member[]
                }]);
            }

            if (i <= 2) {
                console.log(`filtering abstract for ${table}`);
                teams.set(table, teams.get(table)?.filter(t => abstractIds.get(table)?.includes(t.id) || false) || []);
            }
            console.log('-')
        }
        console.log(`|==================|\n`);
        resolve(teams);
    });
}

const abstractIds: Map<Table, number[]> = await parseAbstractSubmittedTeamIds();
const members: Map<number, Member> = await parseMembers();
const participation: Map<Table, Team[]> = await parseParticipation(members, abstractIds);

// Write CSV files
(() => {
    console.log('|= Writing CSV files =|')

    let teamCount = 0;
    let memberCount = 0;
    for (let t = 0; t < Tables.length; t++) {
        let table = Tables[t];
        let teams = participation.get(table) || [];

        let data = "TeamID,Team Name,RegNo,Members,Phone";
        if (t <= 2) data += ",Abstract";
        data += ",Score\n";

        for (let i = 0; i < teams.length; i++) {
            const team = teams[i];
            if (t <= 2) {
                teamCount++;
                memberCount += team.members.length;
            }

            data += `${team.id},${team.name},${team.members[0].regNo},${team.members[0].name},`;
            if (t <= 2) {
                data += `,"=HYPERLINK(""https://sac.mnnit.ac.in/codesangam/api/v1/cs/abstract?id=${team.id}"",""Abstract PDF [${team.id}]"")"`;
            }
            data += `,0\n`;

            for (let j = 1; j < team.members.length; j++) {
                const member = team.members[j];
                data += `,,${member.regNo},${member.name},`;
                if (t <= 2) data += `,`;
                data += `,\n`;
            }
        }
        if (!existsSync(`csv`)) {
            mkdirSync(`csv`);
        }
        writeFileSync(`csv/${table}.csv`, data);
        console.log(`${table}.csv written`);
    }

    console.log(`Total Teams: ${teamCount}`);
    console.log(`Total Members: ${memberCount}`);
})();
