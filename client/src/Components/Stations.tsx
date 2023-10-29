import React, { useEffect, useState } from "react";
import Cards from "./Cards";

interface props {
    leftrotateMoon: () => any;
    rightrotateMoon: () => any;
}

export default function Stations({ leftrotateMoon, rightrotateMoon }: props) {
    const { innerWidth: width, innerHeight: height } = window;
    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.innerHTML = `radius=2*window.innerHeight,fields=$(".item"),container=$("#container"),width=container.width(),height=container.height(),angle=0,step=2*Math.PI/fields.length;fields.each(function(){var t=Math.round(width/2+radius*Math.cos(angle)-$(this).width()/2),i=Math.round(height/2+radius*Math.sin(angle)-$(this).height()/2);$(this).css({left:t+"px",top:i+"px"}),angle+=step});`;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        // <div id="container" style={{ position: "absolute" }}>
        //     <div className="item" style={{ rotate: "89deg" }}>
        //         1
        //     </div>
        //     <div className="item" style={{ rotate: "161deg" }}>
        //         2
        //     </div>
        //     <div className="item" style={{ rotate: "-127deg" }}>
        //         3
        //     </div>
        //     <div className="item" style={{ rotate: "-55deg" }}>
        //         4
        //     </div>
        //     <div className="item" style={{ rotate: "17deg" }}>
        //         5
        //     </div>
        // </div>
        <div id="container" style={{ zIndex: "1000", position: "absolute" }}>
            <div className="item sm:scale-50 md:scale-75 lg:scale-100" style={{ rotate: "89deg" }}>
                <Cards
                    leftrotateMoon={leftrotateMoon}
                    rightrotateMoon={rightrotateMoon}
                    eventn="Logical Rhythm"
                    eventdescription="Logical Rythm is a machine learning event that empowers participants with essential knowledge and skills in data analysis, algorithm development, and model training. This event equips attendees with a strong foundation in artificial intelligence and data science, preparing them for exciting opportunities in these fields."
                    teamsize="Team Size: (1 - 3)"
                />
            </div>
            <div className="item scale-50 md:scale-75 lg:scale-100" style={{ rotate: "161deg" }}>
                <Cards
                    leftrotateMoon={leftrotateMoon}
                    rightrotateMoon={rightrotateMoon}
                    eventn="Softablitz"
                    eventdescription="Softablitz is a Java Desktop Development event that immerses participants in the world of desktop application creation using the Java programming language. It provides hands-on experience, helping participants refine their Java skills while designing and developing powerful desktop software."
                    teamsize="Team Size: (1 - 3)"
                />
            </div>
            <div className="item scale-50 md:scale-75 lg:scale-100" style={{ rotate: "-127deg" }}>
                <Cards
                    leftrotateMoon={leftrotateMoon}
                    rightrotateMoon={rightrotateMoon}
                    eventn="ContriHub"
                    eventdescription="ContriHub is an event focused on open-source development, aligning with Hacktoberfest. It encourages participants to contribute to open-source projects, fostering collaboration within the open-source community. Participants can gain experience in coding, issue tracking, and open-source contribution during this event."
                    teamsize="Team Size: 1"
                />
            </div>
            <div className="item scale-50 md:scale-75 lg:scale-100" style={{ rotate: "-55deg" }}>
                <Cards
                    leftrotateMoon={leftrotateMoon}
                    rightrotateMoon={rightrotateMoon}
                    eventn="Webster"
                    eventdescription="Webster is a web development-focused event, emphasizing the enhancement of participants' skills in creating web applications. It provides opportunities for individuals to learn about web technologies, frameworks, and best practices in the field."
                    teamsize="Team Size: (1 - 3)"
                />
            </div>
            <div className="item scale-50 md:scale-75 lg:scale-100" style={{ rotate: "17deg" }}>
                <Cards
                    leftrotateMoon={leftrotateMoon}
                    rightrotateMoon={rightrotateMoon}
                    eventn="Droidrush"
                    eventdescription="Droidrush is an event centered around Android development, where participants can delve into the world of Android app development. This event offers hands-on experience in building Android applications, exploring the Android ecosystem, and understanding mobile app design principles."
                    teamsize="Team Size: (1 - 3)"
                />
            </div>
        </div>
    );
}
