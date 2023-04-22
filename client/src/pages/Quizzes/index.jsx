import styles from "./index.module.css";
import { Categories, FilterLevels, Leaderboard } from "../../components";
import React, { useState } from "react";

export default function Quizzes() {
  const [level, setLevel] = useState("gcse");
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)

  return (
    <>
      <Leaderboard leaderboardOpen={leaderboardOpen} setLeaderboardOpen={setLeaderboardOpen} />
      <div className={styles["quizzes"]}>
        <div className={styles["container"]}>
          <h1 className={styles["title"]} role="headingone">
            Quizzes
          </h1>
          <div className={styles["content"]}>
            <div className={styles["options"]}>
              <FilterLevels level={level} setLevel={setLevel} />
              <button className={styles["btn"]} onClick={() => setLeaderboardOpen(!leaderboardOpen)}>Leaderboard</button>
            </div>
            <div className={styles["categories"]}>
              <Categories level={level} setLevel={setLevel} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
