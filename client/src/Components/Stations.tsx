import React, { useEffect, useState } from 'react';
import Cards from './Cards';

interface props {
    leftrotateMoon: () => any;
}


export default function Stations({ leftrotateMoon }: props) {

    const [factor, setFactor] = useState(2.5);

    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.innerHTML = `var factor=${factor},radius=Math.sqrt(screen.width*screen.width+factor*screen.height*factor*screen.height)/2,fields=$(".item"),container=$("#container"),width=container.width(),height=container.height(),angle=0,step=2*Math.PI/fields.length;fields.each(function(){var t=Math.round(width/2+radius*Math.cos(angle)-$(this).width()/2),i=Math.round(height/2+radius*Math.sin(angle)-$(this).height()/2);$(this).css({left:t+"px",top:i+"px"}),angle+=step});`;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);


    return (
        <div id="container" style={{ position: "absolute" }}>
            <div className="item" style={{ rotate: "89deg" }}>
                <Cards leftrotateMoon={leftrotateMoon} eventn={3} eventdescription=' Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
            </div>
            <div className="item" style={{ rotate: "161deg" }}>
                <Cards leftrotateMoon={leftrotateMoon} eventn={4} eventdescription=' Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
            </div>
            <div className="item" style={{ rotate: "-127deg" }}>
                <Cards leftrotateMoon={leftrotateMoon} eventn={5} eventdescription=' Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />

            </div>
            <div className="item" style={{ rotate: "-55deg" }}>
                <Cards leftrotateMoon={leftrotateMoon} eventn={1} eventdescription=' Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
            </div>
            <div className="item" style={{ rotate: "17deg" }}>
                <Cards leftrotateMoon={leftrotateMoon} eventn={2} eventdescription=' Lorem ipsum dolor sit amet, cill dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
            </div>
        </div>
    )
}