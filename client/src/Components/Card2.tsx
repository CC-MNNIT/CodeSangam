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
        <div style={{ width: "100vw" }} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div >
                <img className="rounded-t-lg" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" alt="" />
            </div>
            <div className="p-5">
                <div>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{eventn}</h5>
                </div>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{eventdescription}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{teamsize}</p>
                <Button variant="text" color="gray" className="bg-gray-200 mx-2 my-1 flex-1 h-[3rem] items-center">
                    Problem Statement
                </Button>
            </div>
        </div>
    )
}
