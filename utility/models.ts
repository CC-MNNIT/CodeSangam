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
    members: Member[]
};

export { Table, Tables, Member, Team };
