import { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function Leaderboard({ leaderboardOpen, setLeaderboardOpen }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      const response = await fetch(
        `http://localhost:8080/leaderboard/subject/Geography`
      );

      const data = await response.json();

      setLeaderboard([...leaderboard, data]);
    };

    getLeaderboard();
  }, []);

  return (
    <div
      style={{ display: leaderboardOpen ? "flex" : "none" }}
      className={`${styles["overlay"]}`}
    >
      <div className={styles["popup"]}>
        <div className={styles["leaderboard-options"]}>
          <button
            onClick={() => setLeaderboardOpen(!leaderboardOpen)}
            className={styles["btn"]}
          >
            &times;
          </button>
          <h2 className={styles["leaderboard-title"]}>Leaderboard</h2>
        </div>
        <table className={styles["table"]}>
          <thead>
            {console.log(leaderboard)}
            <tr className={styles["table-row"]}>
              <th className={styles["table-heading"]}>Rank</th>
              <th className={styles["table-heading"]}>Username</th>
              <th className={styles["table-heading"]}>Score</th>
              <th className={styles["table-heading"]}>Accuracy</th>
              <th className={styles["table-heading"]}>Times Played</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0
              ? leaderboard.map((entry) => {
                  return entry.map((e, i) => {
                    return (
                      <tr key={i} className={styles["table-row"]}>
                        <td className={styles["table-heading"]}>#{i + 1}</td>
                        <td className={styles["table-heading"]}>
                          {e.username}
                        </td>
                        <td className={styles["table-heading"]}>{e.score}</td>
                        <td className={styles["table-heading"]}>
                          {e.accuracy}%
                        </td>
                        <td className={styles["table-heading"]}>
                          {e.quiz_played}
                        </td>
                      </tr>
                    );
                  });
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
