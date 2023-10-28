export interface Team {
    members: Member[],
    name: string,
    score: number,
    size: number,
    team_id: number
}

export interface Member {
    avatar: string,
    email: string,
    name: string,
    reg_no: string
}
