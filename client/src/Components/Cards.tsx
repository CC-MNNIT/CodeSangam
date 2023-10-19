import React, { useState, useEffect } from 'react';


interface props {
    leftrotateMoon: () => any;
    eventn: number,
    eventdescription: string
}

function Cards({ leftrotateMoon, eventn, eventdescription }: props) {
    var eventid = "space-card-box-" + eventn;
    var spaceid1 = "l1-" + eventn;
    var spaceid2 = "l2-" + eventn;
    var spaceid3 = "l3-" + eventn;
    var spaceid4 = "l4-" + eventn;
    return (
        <div className="wrapper">
            <div id={eventid} className="space-card">
                <div className="space-card-left">
                    <div className="space-card-left-title">Event {eventn}</div>
                    <div className="space-card-left-subtext">
                        {eventdescription}
                    </div>
                    <div className="space-card-left-planets">
                        <div className="space-card-left-planet-1"></div>
                        <div className="space-card-left-planet-2"></div>
                        <div className="space-card-left-planet-3"></div>
                    </div>
                    <div className="space-card-left-button">
                        <button>Explore</button>
                        <button onClick={() => { leftrotateMoon(); }}>➔</button>
                    </div>
                </div>
                <div className="space-card-right">
                    <div className="space-card-right-sun"></div>
                    <div id={spaceid2} className="space-card-right-planet-1"></div>
                    <div id={spaceid3} className="space-card-right-planet-2"></div>
                    <div id={spaceid4} className="space-card-right-planet-3"></div>
                    <div id={spaceid1} className="space-card-right-stars-container">
                        <div className="space-card-right-stars"></div>
                        <div className="space-card-right-shootingstar-1"></div>
                        <div className="space-card-right-shootingstar-2"></div>
                        <div className="space-card-right-shootingstar-3"></div>
                        <div className="space-card-right-shootingstar-4"></div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Cards;