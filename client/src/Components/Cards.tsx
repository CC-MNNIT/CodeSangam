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
    var eventid = "space-card-box-" + eventn;
    var spaceid1 = "l1-" + eventn;
    var spaceid2 = "l2-" + eventn;
    var spaceid3 = "l3-" + eventn;
    var spaceid4 = "l4-" + eventn;
    return (
        <div className="">
            <div id="card" className="w-[35rem] h-[30rem]" >
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
    );
}

export default Cards;