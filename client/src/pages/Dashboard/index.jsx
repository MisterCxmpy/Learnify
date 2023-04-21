import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Flashcard } from "../../components";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [userCreated, setUserCreated] = useState([]);

  const getUser = async () => {
    const response = await fetch(
      `http://localhost:8080/users/username/${localStorage.getItem("user_id")}`
    );

    setUsername(await response.text());
  };

  const getFavoritedCards = async () => {
    const response = await fetch(
      `http://localhost:8080/flashcards/favorite/user/${localStorage.getItem(
        "user_id"
      )}`
    );

    const data = await response.json();

    setFlashcards(data);
  };

  const checkFavorites = async () => {
    const userId = localStorage.getItem("user_id");
    const response = await fetch(
      `http://localhost:8080/flashcards/favorite/user/${userId}/`
    );

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const cardIds = data.map((d) => d.card_id);
      setFavourites(cardIds);
    }
  };

  const getUserCreated = async (e) => {
    const userId = localStorage.getItem("user_id");

    const response = await fetch(
      `http://localhost:8080/flashcards/user/${userId}`
    );

    const data = await response.json();

    if (response.ok) {
      setUserCreated(data);
    } else {
      console.log("Something failed, very sad! :(");
    }
  };

  useEffect(() => {
    getUser();
    checkFavorites();
    getUserCreated();
  }, []);

  useEffect(() => {
    getFavoritedCards();
  }, [favourites]);

  return (
    <div className={styles["dashboard"]}>
      <div className={styles["container"]}>
        <h1 className={styles["title"]}>Welcome {username}</h1>
        <div className={styles["content"]}>
          <h1 className={styles["content-heading"]}>Favourited flashcards</h1>
          <div className={styles["cards"]}>
            {Array.isArray(flashcards) && flashcards.length > 0 ? (
              flashcards.map((f) => {
                return (
                  <Flashcard
                    key={f.card_id}
                    f={f}
                    favourites={favourites}
                  />
                );
              })
            ) : (
              <p className={styles["no-flash"]}>
                No favourited flashcards yet...
              </p>
            )}
          </div>
          <h1 className={styles["content-heading"]}>{username}'s flashcards</h1>
          <div className={styles["cards"]}>
            {Array.isArray(userCreated) && userCreated.length > 0 ? (
              userCreated.map((f) => {
                return (
                  <Flashcard
                    key={f.card_id}
                    f={f}
                    getColours={getColours}
                    handleFlip={handleFlip}
                    handleFavorites={handleFavorites}
                    flippedCards={flippedCards}
                    favourites={favourites}
                  />
                );
              })
            ) : (
              <p className={styles["no-flash"]}>No created flashcards yet...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
