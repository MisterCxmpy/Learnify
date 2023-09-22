import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import React, { useEffect, useState, useRef } from "react";

export default function QuizQuestion({
  questions,
  setIsFinished,
  score,
  setScore,
  setIncorrect,
  subject,
}) {
  const [toggle, setToggle] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState([]);
  const [count, setCount] = useState(0);
  const optionsRef = useRef();
  const navigate = useNavigate();

  const getColours = () => {
    const colours = {
      orange: {
        primary: "#D47902",
        secondary: "#B16610",
      },
      red: {
        primary: "#F26E6E",
        secondary: "#CF4B4B",
      },
      green: {
        primary: "#4CB731",
        secondary: "#2C8715",
      },
      blue: {
        primary: "#368DDD",
        secondary: "#1D6CB5",
      },
    };

    return colours;
  };

  const updateQuestion = async () => {
    if (count < questions.length) {
      setQuestion(questions[count]);
      setAnswers(
        [
          questions[count].answer,
          questions[count].fake_answer1,
          questions[count].fake_answer2,
          questions[count].fake_answer3,
        ].sort(() => Math.random() - 0.5)
      );
      setCount(count + 1);
      setToggle(false);
      setIsFinished(false);
      let i = 0;
      for (const o of optionsRef.current.children) {
        o.style.background = getColours()[Object.keys(getColours())[i]].primary;
        o.style.border = `6.5px solid ${
          getColours()[Object.keys(getColours())[i]].secondary
        }`;
        o.removeAttribute("disabled");
        i++;
      }
    } else {
      setToggle(true);
      setIsFinished(true);
    }
  };

  useEffect(() => {
    updateQuestion();
    setToggle(false);
  }, []);

  const handleCheck = (e) => {
    const options = optionsRef.current.children;
    for (const o of options) {
      if (o.className.includes("incorrect")) {
        o.style.background = "rgb(243, 85, 85)";
        o.style.border = "6.5px solid rgb(243, 85, 85)";
      } else {
        o.style.background = "rgb(84, 223, 79)";
        o.style.border = "6.5px solid rgb(84, 223, 79)";
      }
      o.setAttribute("disabled", true);
    }

    e.target.style.border = `6.5px solid ${
      getColours()[Object.keys(getColours())[2]].secondary
    }`;

    if (e.target.textContent == question.answer) {
      setScore(score + 1);
    } else {
      setIncorrect((incorrect) => [
        ...incorrect,
        { question: question.question, answer: question.answer },
      ]);
    }

    const timer = setTimeout(() => {
      updateQuestion();
    }, 500);
  };

  const handleSubmit = () => {
    if (toggle) {
      const id = localStorage.getItem("user_id");
      updateScore(id, score, questions.length);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [toggle]);

  const updateLeaderboard = async (_score, _score_out_of) => {
    const userId = localStorage.getItem("user_id");

    const userResponse = await fetch(
      `https://learnify-api-c1uk.onrender.com/leaderboard/entry/${
        subject.split(" ")[0]
      }/${userId}`,
      {}
    );
    const user = await userResponse.json();

    const { score, quiz_played } = user;

    const newScore = (score ?? 0) + _score;
    const newQuizPlayed = (quiz_played ?? 0) + 1;
    const newAccuracy = Math.round(
      (newScore / (10 * newQuizPlayed ?? _score_out_of)) * 100
    );

    const options = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: subject.split(" ")[0],
        score: newScore,
        accuracy: newAccuracy,
        quiz_played: newQuizPlayed,
      }),
    };

    const response = await fetch(
      `https://learnify-api-c1uk.onrender.com/leaderboard/update/${
        subject.split(" ")[0]
      }/${userId}`,
      options
    );

    if (response.ok) {
      console.log("Successfully updated user leaderboard entry!");
    } else {
      const userResponse = await fetch(
        `https://learnify-api-c1uk.onrender.com/users/username/single/${userId}`
      );

      const user = await userResponse.json();

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          username: user.username,
          subject: subject.split(" ")[0],
          score: newScore,
          accuracy: newAccuracy,
          quiz_played: newQuizPlayed,
        }),
      };

      const response = await fetch(
        `https://learnify-api-c1uk.onrender.com/leaderboard/`,
        options
      );

      if (response.ok) {
        console.log("Successfully created user leaderboard entry!");
      } else {
        console.log("Failed to update and create user leaderboard entry!");
      }
    }
  };

  async function updateScore(id, score, score_out_of) {
    const options = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: score,
        score_out_of: score_out_of,
      }),
    };
    const response = await fetch(
      `https://learnify-api-c1uk.onrender.com/users/score/${id}`,
      options
    );
    await response.json();

    updateLeaderboard(score, score_out_of);
  }

  return (
    <>
      <div className={styles["parent"]}>
        <div className={styles["options"]}>
          <p className={`${styles["score"]} ${styles["btn"]}`}>
            Score: {score}
          </p>
          <button
            onClick={() => navigate(-1)}
            className={`${styles["flashcard-back"]} ${styles["btn"]}`}
          >
            Back
          </button>
        </div>
        <div className={styles["content"]}>
          <div className={styles["question-info"]}>
            <h2 role="headingtwo"> Question {count} :</h2>
            <h1 className={styles["question"]}>{question.question}</h1>
          </div>
          <div className={styles["options-container"]} ref={optionsRef}>
            {answers.map((answer, i) => (
              <button
                key={i}
                className={`${styles["option"]} ${
                  styles[answer === question.answer ? "correct" : "incorrect"]
                }`}
                style={{
                  background:
                    getColours()[Object.keys(getColours())[i]].primary,
                  border: `6.5px solid ${
                    getColours()[Object.keys(getColours())[i]].secondary
                  }`,
                }}
                onClick={handleCheck}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
