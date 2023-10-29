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

function Cards({ leftrotateMoon, rightrotateMoon, eventn, eventdescription, teamsize }: props) {
    return (
        <div className="">
            <div id="card" className="w-[40rem] h-[37rem]" >
                <h1 className="textGlow h1tag blinking">{eventn} :</h1>
                <div className="plain">{eventdescription}
                    <span className="fast-blinking">▮</span>
                </div>
                <br></br>
                <br></br>
                <div className="plain">
                    {teamsize}
                </div>
                <div>
                    {
                        eventn === "ContriHub" ?
                            <a href="https://sac.mnnit.ac.in/contrihub" target="_blank">
                                <button className='card -mt-5 float-right text-blue-500 event-selected border-2 rounded-t-lg inline-block p-2 md:hover:text-black md:hover:bg-white transition-colors'>
                                    Website
                                </button>
                            </a>
                            :
                            <button className='card -mt-5 float-right text-blue-500 event-selected border-2 rounded-t-lg inline-block p-2 md:hover:text-black md:hover:bg-white transition-colors'>Problem Statement</button>
                    }
                </div>
            </div>

        </div>
    );
}

export default Cards;