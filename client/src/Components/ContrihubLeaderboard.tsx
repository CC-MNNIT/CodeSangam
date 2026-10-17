import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { contrihubRankingsDataAPI } from "../Utils/APIRoutes";
import Podium from "./Podium";
import { Ranking } from "../Models/ContrihubModel";
import Loader from "./Loader/Loader";
import { GrimoireTable, NotOutYet, RankCell } from "./Leaderboard/shared";
import { usePodiumMotion } from "./Leaderboard/usePodiumMotion";
import { RESULTS_ANNOUNCED } from "../Utils/Config";

export default function ContrihubLeaderboard() {
  const [isListRecieved, setIsListRecieved] = useState(false);
  const [rankingsData, setRankingsData] = useState<Ranking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!RESULTS_ANNOUNCED) return;
    let cancelled = false;
    async function fetchData() {
      try {
        const { data } = await axios.get(contrihubRankingsDataAPI);
        if (!cancelled && Array.isArray(data) && data.length >= 3) {
          setRankingsData(data);
          setIsListRecieved(true);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  usePodiumMotion(root, [isLoading, isListRecieved]);

  if (!RESULTS_ANNOUNCED) return <NotOutYet label="TO BE ANNOUNCED" />;
  if (isLoading) return <Loader />;
  if (!isListRecieved) return <NotOutYet />;

  return (
    <div ref={root}>
      <Podium first={rankingsData[0]} second={rankingsData[1]} third={rankingsData[2]} />
      <GrimoireTable
        columns={[
          { label: "Rank" },
          { label: "Username" },
          { label: "Reg No" },
          { label: "Bonus Points" },
          { label: "Total Points" },
        ]}
        rows={rankingsData.map((r, i) => [
          <RankCell rank={i + 1} />,
          r.user_name,
          r.reg_no,
          r.bonus_points,
          r.total_points,
        ])}
      />
    </div>
  );
}
