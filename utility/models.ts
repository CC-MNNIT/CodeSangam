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

export { Member, Team };
