// NeonText.tsx

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface NeonTextProps {
    text: string;
}

const NeonText: React.FC<NeonTextProps> = ({ text }) => {
    const neonTextRef = useRef(null);

    useEffect(() => {
        const neonText = neonTextRef.current;

        if (neonText) {
            gsap.to(neonText, {
                textShadow:
                    "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff",
                color: "#ff00ff",
                repeat: -1,
                yoyo: true,
                duration: 1,
            });
        }
    }, []);

    return (
        <h1
            ref={neonTextRef}
            className="text-4xl font-bold p-4 bg-black text-white"
        >
            {text}
        </h1>
    );
};

export default NeonText;
