import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function FlashcardsActivity() {
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [i, setI] = useState(0);
  const { category } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate()

  const getColours = () => {
    switch (category) {
      case "Geography":
        return { primary: "#4CB731", secondary: "#2C8715" };
      case "History":
        return { primary: "#F26E6E", secondary: "#CF4B4B" };
      case "Chemistry":
        return { primary: "#368DDD", secondary: "#1D6CB5" };
      case "Biology":
        return { primary: "#D47902", secondary: "#B16610" };
      case "Physics":
        return { primary: "#F26E6E", secondary: "#CF4B4B" };
      case "Maths":
        return { primary: "#368DDD", secondary: "#1D6CB5" };
      case "English Literature":
        return { primary: "#D47902", secondary: "#B16610" };
      case "Sports Science":
        return { primary: "#E5DF46", secondary: "#D8B603" };
      case "Religious Education":
        return { primary: "#4CB731", secondary: "#2C8715" };
      default:
        console.log(category);
        break;
    }
  };

  function handleFlip() {
    setIsFlipped(!isFlipped)
  }

  const getData = async () => {
    const response = await fetch(
      `https://learnify-api-c1uk.onrender.com/flashcards/${category}`
    );

    const data = await response.json();

    setFlashcards(data.sort(() => Math.random() - 0.5));

    setLoaded(true);
  };

  useEffect(() => {
    getData();
  }, []);

  function next() {
    setI(i + 1);
  }
  function prev() {
    if (i > 0) setI(i - 1);
  }
  
  function CurrentFlashcard() {
    return (
      <div className={styles["container"]}>
        <h1 className={styles["title"]} role='headingone'>{category} Activiy</h1>
        <div className={styles["content"]}>
          <div className={styles["control-options"]}>
            <button onClick={() => navigate(-1)} className={`${styles["flashcard-back"]} ${styles["btn"]}`}>Back</button>
          </div>
          <div
            key={flashcards[i].card_id}
            onClick={() => handleFlip()}
            className={styles["flashcard-card"]}
            style={{
              transform: isFlipped
                ? "rotateY(180deg)"
                : "rotateY(0deg)",
              background: getColours().primary,
              border: `10px solid ${getColours().secondary}`,
            }}
          >
            <div className={styles["front"]}>
              <h2 className={styles["flashcard-title"]}>
                {flashcards[i].collection}
              </h2>
              <h2 className={styles["flashcard-question"]}>
                {flashcards[i].question}
              </h2>
            </div>
            <div className={styles["back"]}>
              <h2 className={styles["flashcard-answer"]}>{flashcards[i].fact}</h2>
            </div>
          </div>
          <div className={styles["options"]}>
            <button className={styles["option"]} onClick={prev}>
              prev
            </button>
            <button className={styles["option"]} onClick={next}>
              next
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (i === 0) {
    return (
      <div className={styles["activity"]}>
        {loaded ? <CurrentFlashcard /> : <h1>loading</h1>}
      </div>
    );
  } else if (flashcards[i]) {
    return (
      <div className={styles["activity"]}>
        {loaded ? <CurrentFlashcard /> : <h1>loading</h1>}
      </div>
    );
  } else {
    return (
      <div className={styles["activity"]}>
        <div className={styles["no-more-cards"]}>
          <h2>Flashcards finished! Woohoo 🥳</h2>
        </div>
        <div className={styles["options"]}>
          <button className={styles["option"]} onClick={prev}>
            prev
          </button>
          <button className={styles["option"]}>
            <Link className={styles["Link"]} to='/dashboard/flashcards'>exit</Link>
          </button>
        </div>
      </div>
    );
  }
}
