import { useState, useEffect, useRef } from "react";
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { TeamMember, Year } from '../Utils/TeamMember';
import { gsap } from 'gsap';

export default function Team() {
  const [activeYear, setActiveYear] = useState<string | null>('24-25');
  const [topDivOpacity, setTopDivOpacity] = useState(1);
  const [activeIndices, setActiveIndices] = useState<number[]>([0]);
  // Create separate refs for each team year section
  const team24_25Ref = useRef<HTMLDivElement | null>(null);
  const team23_24Ref = useRef<HTMLDivElement | null>(null);
  const team22_23Ref = useRef<HTMLDivElement | null>(null);
  const refArray = [team24_25Ref, team23_24Ref, team22_23Ref];
  const handleScroll = () => {
    const currentScroll = window.scrollY;
    const maxScroll = 220
    const newOpacity = Math.max(0, 1 - currentScroll / maxScroll);
    setTopDivOpacity(newOpacity);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleYearClick = (year: string, index: number, ref: React.RefObject<HTMLDivElement>) => {

    if (activeYear === year) {
      gsap.to(ref.current, { duration: 0.5, opacity: 0, scale: 0.8, onComplete: () => setActiveYear(null) });
      //remove the index from the active list
      if (year !== '24-25') {
        setActiveIndices(() => []);
      }

    } else {

      setActiveYear(year);
      setActiveIndices(() => {
        const newActiveList = [];
        for (let i = 0; i <= index; i++) {
          newActiveList.push(i);
        }
        return newActiveList;
      })
      gsap.fromTo(ref.current,
        { opacity: 0, scale: 0.8 },
        { duration: 0.5, opacity: 1, scale: 1 });
    }
  };

  return (
    <div className="flex justify-center min-h-screen relative z-10">
      <div className={`year-container mt-56 text-center space-y-4 w-screen`}>

        {Year.map((year, index) => (
          <div className="group relative cursor-pointer" key={index}>
            <div
              className="current-year flex justify-center items-center text-white w-full p-4 sm:p-3 lg:p-5 bg-gray-800 rounded-md transition-opacity duration-300 hover:bg-gray-700"
              style={{ opacity: activeIndices.includes(index) ? topDivOpacity : 1 }}
              onClick={() => handleYearClick(year, index, refArray[index])}
            >
              <p className="card podium__city-team text-2xl sm:text-lg lg:text-3xl font-bold">
                Team {year}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-gray-400 transition-transform duration-300 group-hover:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </div>
            <div ref={refArray[index]} className={`team-members ${activeYear === year ? 'flex' : 'hidden'} flex-wrap justify-around mt-4`}>
              {TeamMember.year[index][year].map((member, index) => (
                <div key={index} className="container-team podium-team sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2">
                  <div className="podium__item-team">
                    <div className="podium__rank team-individual flex flex-col">
                      <div className="flex justify-center items-center p-4">
                        <div className="image-cropper-contri mt-48 overflow-hidden rounded-full border-4 border-white shadow-lg transition-shadow duration-300 group-hover:shadow-glow transform hover:scale-110 motion-safe:animate-bounce">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <p className="card podium__city-team text-center mt-44 text-lg sm:text-base">{member.name}</p>
                      <div className="flex justify-center space-x-4 text-gray-500">
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noreferrer">
                            <FaGithub className="h-6 w-6" aria-hidden="true" />
                          </a>
                        )}
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noreferrer">
                            <FaTwitter className="h-6 w-6" aria-hidden="true" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noreferrer">
                            <FaLinkedin className="h-6 w-6" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}