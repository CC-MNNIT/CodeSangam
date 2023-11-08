import { exec } from "child_process"
import { XMLParser, XMLValidator } from "fast-xml-parser"
import { writeFileSync } from "fs"

const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
const DB_IP: string = process.env.DB_IP || "";
const DB_USER: string = process.env.DB_USER || "";
const DB: string = process.env.DB || "";

interface Member {
    name: string
    regNo: string
    phone: string
};

interface Team {
    id: number
    name: string
    members: Member[]
};

function fetchSQL(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`mysql -u ${DB_USER} -h ${DB_IP} -p"${DB_PASSWORD}" ${DB} -e "${query}" --xml`,
            (err, stdout, stderr) => {
                if (err) {
                    console.warn(stderr);
                }
                resolve(stdout ? stdout : stderr);
            });
    });
}

const tables = ["droidrush", "webster", "softablitz", "logical"];
const parser = new XMLParser();

async function parseAbstractSubmittedTeamIds(): Promise<Map<string, number[]>> {
    return new Promise(async (resolve, reject) => {
        const xmlContents: string[] = [];

        for (let i = 0; i < tables.length - 1; i++) {
            let table = tables[i];
            console.log(`loading abstracts ${table}`);
            let out = await fetchSQL(`select t.id from (select t.id from abstract a inner join team t on a.team_id = t.id) t inner join ${table} e on t.id = e.team_id`);
            xmlContents.push(out);
        }

        const abstractIds: Map<string, number[]> = new Map();
        let absCount = 0;
        for (let i = 0; i < tables.length - 1; i++) {
            console.log(`valid ${tables[i]}:`, XMLValidator.validate(xmlContents[i]));

            const { resultset } = parser.parse(xmlContents[i]);
            const { row } = resultset;
            const teamIds: number[] = [];
            for (let r = 0; r < row.length; r++) {
                const { field } = row[r];
                teamIds.push(Number(field));
            }
            console.log(tables[i], teamIds.length);
            absCount += teamIds.length;

            abstractIds.set(tables[i], teamIds);
        }
        console.log(`Total Abstracts: ${absCount}`);
        resolve(abstractIds);
    });
}

async function parseMembers(): Promise<Map<number, Member>> {
    return new Promise(async (resolve, reject) => {
        console.log(`loading members`);
        const xmlContents = await fetchSQL(`select uid, name, registration_no from user`);

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
        resolve(members);
    });
}

async function parseParticipation(members: Map<number, Member>, abstractIds: Map<string, number[]>): Promise<Map<string, Team[]>> {
    return new Promise(async (resolve, reject) => {
        const xmlContents: string[] = [];

        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            console.log(`loading teams ${table}`);
            let out = await fetchSQL(`select id, team.name, leader_id, m_id1, m_id2 from team inner join ${table} on team.id=${table}.team_id`);
            xmlContents.push(out);
        }

        const teams: Map<string, Team[]> = new Map();
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
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
        }
        resolve(teams);
    });
}

const abstractIds: Map<string, number[]> = await parseAbstractSubmittedTeamIds();
const members: Map<number, Member> = await parseMembers();
const participation: Map<string, Team[]> = await parseParticipation(members, abstractIds);

// Write CSV files
(() => {
    let teamCount = 0;
    let memberCount = 0;
    for (let t = 0; t < tables.length; t++) {
        let table = tables[t];
        let teams = participation.get(table) || [];

        let data = "TeamID,Team Name,RegNo,Members,Phone,Abstract,Score\n";
        for (let i = 0; i < teams.length; i++) {
            const team = teams[i];
            if (t <= 2) {
                teamCount++;
                memberCount += team.members.length;
            }
            data += `${team.id},${team.name},${team.members[0].regNo},${team.members[0].name},,=HYPERLINK(https://sac.mnnit.ac.in/codesangam/api/v1/cs/abstract?id=${team.id}),0\n`;
            for (let j = 1; j < team.members.length; j++) {
                const member = team.members[j];
                data += `,,${member.regNo},${member.name},,,\n`;
            }
        }
        writeFileSync(`csv/${table}.csv`, data);
    }

    console.log(`Total Teams: ${teamCount}`);
    console.log(`Total Members: ${memberCount}`);
})();
