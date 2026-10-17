import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EventsPodium from "./EventsPodium";
import { Team } from "../Models/EventModel";
import Loader from "./Loader/Loader";
import { GrimoireTable, NotOutYet, RankCell } from "./Leaderboard/shared";
import { usePodiumMotion } from "./Leaderboard/usePodiumMotion";
import { RESULTS_ANNOUNCED } from "../Utils/Config";

interface props {
  currentAPI: string;
}

export default function EventLeaderboard({ currentAPI }: props) {
  const [isListRecieved, setIsListRecieved] = useState(false);
  const [rankingsData, setRankingsData] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!RESULTS_ANNOUNCED) return;
    let cancelled = false;
    async function fetchData() {
      try {
        //set loading true at the start of fetching data
        setIsLoading(true);
        setIsListRecieved(false);
        const { data } = await axios.get(currentAPI);
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setRankingsData(data);
          setIsListRecieved(true);
        }
      } catch (err) {
        console.log(err);
      } finally {
        //stop loading when data fetch or error occured
        setTimeout(() => {
          if (!cancelled) setIsLoading(false);
        }, 1000);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [currentAPI]);

  usePodiumMotion(root, [isLoading, isListRecieved, currentAPI]);

  if (!RESULTS_ANNOUNCED) return <NotOutYet label="TO BE ANNOUNCED" />;
  if (isLoading) return <Loader />;
  if (!isListRecieved) return <NotOutYet />;

  return (
    <div ref={root}>
      <EventsPodium teams={rankingsData} />
      <GrimoireTable
        columns={[{ label: "Rank" }, { label: "Team Name" }, { label: "Team ID" }]}
        rows={rankingsData.map((team, i) => [<RankCell rank={i + 1} />, team.name, team.team_id])}
      />
    </div>
  );
}
