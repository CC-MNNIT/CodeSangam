import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
interface props {
    leftrotateMoon: () => any;
    rightrotateMoon: () => any;
    eventn: string,
    eventdescription: string,
    teamsize?: string
}
export default function Card2({ leftrotateMoon, rightrotateMoon, eventn, eventdescription, teamsize }: props) {
    return (
        <div className="">
            <div id="card2" className="w-[35rem]" >
                <h1 className="textGlow h1tag blinking">{eventn} :</h1>
                <div className="plain">{eventdescription}
                    <span className="fast-blinking">▮</span>
                </div>
                <br></br>
                <br></br>
                <div className="plain">
                    {teamsize}
                </div>
                <br>
                </br>
                <br>
                </br>
                <div>
                    <button className='card text-blue-500 event-selected border-2 rounded-t-lg inline-block p-2 md:hover:text-blue-500'>Problem Statement</button>
                </div>
            </div>
        </div>
    )
}
