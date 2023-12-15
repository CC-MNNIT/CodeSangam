export interface Team {
    members: Member[],
    name: string,
    size: number,
    team_id: number
}

export interface Member {
    avatar: string,
    email: string,
    name: string,
    reg_no: string
}
