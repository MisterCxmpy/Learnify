import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Flashcard } from "../../components";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [userCreated, setUserCreated] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:8080/users/username/${localStorage.getItem("user_id")}`
      );
      const data = await response.text();
      setUsername(data);
    };
    
    const fetchFavourites = async () => {
      const response = await fetch(
        `http://localhost:8080/flashcards/favorite/user/${localStorage.getItem("user_id")}`
      );
      const data = await response.json();
      setFlashcards(data);
      setFavourites(data.map((d) => d.card_id));
    };
    
    const fetchUserCreated = async () => {
      const response = await fetch(
        `http://localhost:8080/flashcards/user/${localStorage.getItem("user_id")}`
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
