type Table = "droidrush" | "webster" | "softablitz" | "logical";

const Tables: Table[] = ["droidrush", "webster", "softablitz", "logical"];

interface Member {
    name: string
    regNo: string
    phone: string
};

interface Team {
    id: number
    name: string
    score: number
    members: Member[]
};

interface TeamScore {
    teamId: number
    score: number
};

export { Table, Tables, Member, Team, TeamScore };
