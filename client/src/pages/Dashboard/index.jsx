import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Flashcard } from "../../components";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [userCreated, setUserCreated] = useState([]);

  const fetchFavourites = async () => {
    const response = await fetch(
      `https://learnify-api-c1uk.onrender.com/flashcards/favorite/user/${localStorage.getItem("user_id")}`
    );

    const data = await response.json();
    setFlashcards(data);

    if (data.length > 0) setFavourites(data.map((d) => d.card_id));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `https://learnify-api-c1uk.onrender.com/users/username/${localStorage.getItem("user_id")}`
      );
      const data = await response.text();
      setUsername(data);
    };
    
    const fetchUserCreated = async () => {
      const response = await fetch(
        `https://learnify-api-c1uk.onrender.com/flashcards/user/${localStorage.getItem("user_id")}`
      );
      const data = await response.json();
      if (response.ok) {
        setUserCreated(data);
      } else {
        console.log("Something failed, very sad! :(");
      }
    };
    
    fetchUser();
    fetchFavourites();
    fetchUserCreated();
  }, []);

  useEffect(() => {
    fetchFavourites()
  }, [favourites])

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome {username}</h1>
        <div className={styles.content}>
          <h1 className={styles["content-heading"]}>Favourited flashcards</h1>
          <div className={styles.cards}>
            {flashcards.length > 0 ? (
              flashcards.map((flashcard) => (
                <Flashcard
                  key={flashcard.card_id}
                  f={flashcard}
                  favourites={favourites}
                  setFavourites={setFavourites}
                />
              ))
            ) : (
              <p className={styles["no-flash"]}>
                No favourited flashcards yet...
              </p>
            )}
          </div>
          <h1 className={styles["content-heading"]}>{username}'s flashcards</h1>
          <div className={styles.cards}>
            {userCreated.length > 0 ? (
              userCreated.map((flashcard) => (
                <Flashcard
                  key={flashcard.card_id}
                  f={flashcard}
                  favourites={favourites}
                  setFavourites={setFavourites}
                />
              ))
            ) : (
              <p className={styles["no-flash"]}>No created flashcards yet...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
