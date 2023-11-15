import { exec } from "child_process";

const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
const DB_IP: string = process.env.DB_IP || "";
const DB_USER: string = process.env.DB_USER || "";
const DB: string = process.env.DB || "";

function execSQL(query: string): Promise<string> {
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

export { execSQL };
