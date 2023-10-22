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
        <div className="wrapper">
            <Card className="w-full max-w-[48rem] flex-row bg-white ">
                <CardHeader
                    shadow={false}
                    floated={false}
                    className="m-0 w-2/5 shrink-0  rounded-xl"
                >
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                        alt="card-image"
                        className="h-full w-full object-cover rounded-xl m-0"
                    />
                </CardHeader>
                <CardBody className="w-[60%] h-[30%]">
                    <Typography variant="h6" color="gray" className="mb-4 pt-3 dark:border-gray-600 uppercase">
                        {eventn}
                    </Typography>
                    <Typography color="gray" className="px-4 mb-8 font-normal">
                        {eventdescription}
                    </Typography>
                    <Typography color="gray" className="mb-8 font-normal">
                        {teamsize}
                    </Typography>
                    <div className="flex px-3 py-1">
                        <Button onClick={() => { leftrotateMoon(); }} variant="text" color="gray" className="bg-gray-200 mx-1  flex-1 h-[3rem] items-center">
                            Previous
                        </Button>
                        <Button variant="text" color="gray" className="bg-gray-200 mx-1 flex-1 h-[3rem] items-center">
                            Problem
                        </Button>
                        <Button onClick={() => { rightrotateMoon(); }} variant="text" color="gray" className="bg-gray-200 mx-1 flex-1 h-[3rem] items-center">
                            Next
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default Cards;