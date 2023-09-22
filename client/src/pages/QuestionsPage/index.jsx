import React, { useEffect, useState } from "react";
import { QuizQuestion } from "../../components";
import styles from "./index.module.css";
import { useNavigate, useParams } from "react-router-dom";

export default function QuestionsPage() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [incorrect, setIncorrect] = useState([]);
  const { subject } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const navigate = useNavigate();

  async function getQuestions() {
    const category = subject ? subject.toLowerCase() : undefined;
    const response = await fetch(`https://learnify-api-c1uk.onrender.com/quiz/${category}`);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      setQuestions(data.sort(() => Math.random() - 0.5).splice(0, 10));
    }

    setLoading(false);
  }

  useEffect(() => {
    getQuestions();
  }, []);

  async function createFlashcardFromIncorrect() {
    const counter = { count: 0 };

    await Promise.all(
      incorrect.map(async (inc) => {
        await createFlashcard(inc.question, inc.answer);
        counter.count++;
      })
    );
  }

  async function createFlashcard(question, answer) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collection: subject.split(" ")[0],
        question: question,
        fact: answer,
        user_id: localStorage.getItem("user_id"),
      }),
    };

    const res = await fetch(`https://learnify-api-c1uk.onrender.com/flashcards/`, options);

    if (!res.ok) {
      console.log("Failed to create flashcard");
    }

    navigate("/dashboard");
  }

  function displayQuestion() {
    return (
      <>
        <div
          style={{ display: isFinished ? "flex" : "none" }}
          className={`${styles["overlay"]}`}
        >
          <div className={styles["popup"]}>
            <div className={styles["message"]}>
              <h2>Quiz Complete!</h2>
              <p className={styles["score"]}>
                You scored {score} / {questions.length}
              </p>
              <div className={styles["incorrect"]}>
                {incorrect.length > 0 ? <h2>Incorrect answers</h2> : ""}

                {incorrect.length
                  ? incorrect.map((inc, i) => {
                      return (
                        <p key={i} className={styles["incorrect-answer"]}>
                          {inc.question} -{" "}
                          <span className={styles["inc-answer"]}>
                            {inc.answer}
                          </span>
                        </p>
                      );
                    })
                  : ""}
              </div>
            </div>
            <div className={styles["options"]}>
              <button onClick={() => navigate(-1)} className={styles["btn"]}>
                Return to Categories
              </button>
              {incorrect.length > 0 ? (
                <button
                  onClick={createFlashcardFromIncorrect}
                  className={styles["btn"]}
                >
                  Turn incorrect to Flashcards
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className={styles["quiz-questions"]}>
          <div className={styles["container"]}>
            <h1 className={styles["title"]}>Quizzes</h1>
            <QuizQuestion
              questions={questions}
              setIsFinished={setIsFinished}
              score={score}
              setScore={setScore}
              setIncorrect={setIncorrect}
              subject={subject}
            />
          </div>
        </div>
      </>
    );
  }

  return loading ? (
    <h2>
      <em>loading...</em>
    </h2>
  ) : (
    displayQuestion()
  );
}
