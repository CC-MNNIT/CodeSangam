const Tables = ["droidrush", "webster", "softablitz", "logical"];

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

export { Tables, Member, Team };
