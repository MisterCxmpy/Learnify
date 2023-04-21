import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { CreateFlashcardModal } from "../../components";

export default function FlashcardsList() {
  const { category } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hasColours, setHasColours] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  const getColours = () => {
    // Colours logic
  };

  function handleFlip(cardId) {
    if (flippedCards.includes(cardId)) {
      setFlippedCards(flippedCards.filter((id) => id !== cardId));
    } else {
      setFlippedCards([...flippedCards, cardId]);
    }
  }

  const getData = async () => {
    const response = await fetch(
      `http://localhost:8080/flashcards/${category}`
    );

    const data = await response.json();

    setFlashcards(data);

    setHasColours(false);
  };

  const openCloseModal = (e) => {
    e.stopPropagation();
    setShowModal(!showModal);
  };

  const handleFavorites = async (e, cardId) => {
    e.stopPropagation();
    const userId = localStorage.getItem("user_id");

    const response = await fetch(
      `http://localhost:8080/flashcards/favorite/user/${userId}/card/${cardId}`,
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

  useEffect(() => {
    getData();
    checkFavorites();
  }, []);

  return (
    <>
      <CreateFlashcardModal
        showModal={showModal}
        setShowModal={setShowModal}
        getData={getData}
        primary={getColours().primary}
        secondary={getColours().secondary}
      />
      <div className={styles["flashcards"]}>
        <div className={styles["container"]}>
          <h1 className={styles["title"]}>{`${category} Flashcards`}</h1>
          <div className={styles["content"]}>
            <div className={styles["options"]} role='flashcards'>
              <div>
                <NavLink
                  to={`/dashboard/flashcards/${category}/activity`}
                  className={`${styles["flashcard-practice"]} ${styles["btn"]}`}
                >
                  Practice
                </NavLink>
              </div>
              <div className={styles["create-back"]}>
                <button
                  className={`${styles["flashcard-create"]} ${styles["btn"]}`}
                  onClick={openCloseModal}
                >
                  Create
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className={`${styles["flashcard-back"]} ${styles["btn"]}`}
                >
                  Back
                </button>
              </div>
            </div>
            <div className={styles["cards"]}>
              {flashcards.map((f) => {
                return (
                  <div
                    key={f.card_id}
                    onClick={() => handleFlip(f.card_id)}
                    className={styles["flashcard-card"]}
                    style={{
                      transform: flippedCards.includes(f.card_id)
                        ? "rotateY(180deg)"
                        : "none",
                      background: getColours().primary,
                      border: `6.5px solid ${getColours().secondary}`,
                    }}
                  >
                    <button
                      style={{color: favourites.includes(f.card_id) ? getColours(f.collection).secondary : getColours(f.collection).primary}}
                      className={`${styles["favoriteBtn"]}`}
                      onClick={(e) => handleFavorites(e, f.card_id)}
                    >
                      ★
                    </button>
                    <div className={styles["front"]}>
                      <h2 className={styles["flashcard-question"]}>
                        {f.question}
                      </h2>
                    </div>
                    <div className={styles["back"]}>
                      <h2 className={styles["flashcard-answer"]}>{f.fact}</h2>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
