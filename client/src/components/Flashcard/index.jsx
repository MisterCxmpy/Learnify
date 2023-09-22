import { useEffect, useState } from "react";
import styles from "./index.module.css"

export default function Flashcard({f, favourites, setFavourites, getData}) {

  const [flippedCards, setFlippedCards] = useState([]);

  const getColours = (category) => {
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

  function handleFlip(cardId) {
    if (flippedCards.includes(cardId)) {
      setFlippedCards(flippedCards.filter((id) => id !== cardId));
    } else {
      setFlippedCards([...flippedCards, cardId]);
    }
  }

  async function deleteCard(e, cardId) {
    e.stopPropagation();
    const options = {
      method: "DELETE"
    }

    const response = await fetch(`https://learnify-api-c1uk.onrender.com/flashcards/${cardId}`, options)

    getData()
  }

  const handleFavorites = async (e, cardId) => {
    e.stopPropagation();
    const userId = localStorage.getItem("user_id");

    const response = await fetch(
      `https://learnify-api-c1uk.onrender.com/flashcards/favorite/user/${userId}/card/${cardId}`,
      {
        method: favourites.includes(cardId) ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: favourites.includes(cardId) ? null : JSON.stringify({ cardId }),
      }
    );

    if (response.ok) {
      if (!favourites.includes(cardId)) {
        e.target.style.color = "#3c2970";
        setFavourites([...favourites, cardId]);
      } else {
        e.target.style.color = "black";
        setFavourites(favourites.filter((fav) => fav !== cardId));
      }
      console.log(`Success`);
    } else {
      console.log("Something failed, very sad! :(");
    }
  };

  return ( 
    <div
      key={f.card_id}
      onClick={() => handleFlip(f.card_id)}
      className={styles["flashcard-card"]}
      style={{
        transform: flippedCards.includes(f.card_id)
          ? "rotateY(180deg)"
          : "none",
        background: getColours(f.collection).primary,
        border: `6.5px solid ${getColours(f.collection).secondary}`,
      }}
    >
      <button
        style={{
          color: favourites.includes(f.card_id)
            ? getColours(f.collection).secondary
            : getColours(f.collection).primary,
        }}
        className={`${styles["favoriteBtn"]}`}
        onClick={(e) => handleFavorites(e, f.card_id)}
      >
        ★
      </button>
      <button className={`${styles["removeBtn"]}`} onClick={(e) => deleteCard(e, f.card_id)} >
        &times;
      </button>
      <div className={styles["front"]}>
        <h1 className={styles["flashcard-title"]}>{f.collection}</h1>
        <h2 className={styles["flashcard-question"]}>{f.question}</h2>
      </div>
      <div className={styles["back"]}>
        <h2 className={styles["flashcard-answer"]}>{f.fact}</h2>
      </div>
    </div>
  );
}
