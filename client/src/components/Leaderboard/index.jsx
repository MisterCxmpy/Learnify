import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

export default function Leaderboard({ leaderboardOpen, setLeaderboardOpen }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [subject, setSubject] = useState("Geography");
  const tbodyRef = useRef();

  useEffect(() => {
    const getLeaderboard = async () => {
      const response = await fetch(
        `http://localhost:8080/leaderboard/subject/${subject}`
      );

      const data = await response.json();

      setLeaderboard([...leaderboard, data]);
    };

    tbodyRef.current.innerHTML = "";

    getLeaderboard();
  }, [subject]);

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
          <select
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={styles["leaderboard-subjects"]}
          >
            <option value="Geography" selected>
              Geography
            </option>
            <option value="History">History</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Physics">Physics</option>
            <option value="Maths">Maths</option>
            <option value="English">English</option>
            <option value="Sports_Science">Sports Science</option>
            <option value="Religious_Education">Religious Education</option>
          </select>
          <thead>
            <tr className={styles["table-row"]}>
              <th className={styles["table-heading"]}>Rank</th>
              <th className={styles["table-heading"]}>Username</th>
              <th className={styles["table-heading"]}>Score</th>
              <th className={styles["table-heading"]}>Accuracy</th>
              <th className={styles["table-heading"]}>Times Played</th>
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {leaderboard.length > 0
              ? leaderboard.map((entry) => {
                  return entry.length > 0
                    ? entry.map((e, i) => {
                        return (
                          <tr key={i} className={styles["table-row"]}>
                            <td className={styles["table-heading"]}>
                              #{i + 1}
                            </td>
                            <td className={styles["table-heading"]}>
                              {e.username}
                            </td>
                            <td className={styles["table-heading"]}>
                              {e.score}
                            </td>
                            <td className={styles["table-heading"]}>
                              {e.accuracy}%
                            </td>
                            <td className={styles["table-heading"]}>
                              {e.quiz_played}
                            </td>
                          </tr>
                        );
                      })
                    : "";
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
