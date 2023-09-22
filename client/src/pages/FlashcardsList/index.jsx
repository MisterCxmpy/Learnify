import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { CreateFlashcardModal, Flashcard } from "../../components";

export default function FlashcardsList() {
  const { category } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    const response = await fetch(
      `https://learnify-api-c1uk.onrender.com/flashcards/${category}/${localStorage.getItem("user_id")}`
    );

    const data = await response.json();

    setFlashcards(data);
  };

  const openCloseModal = (e) => {
    e.stopPropagation();
    setShowModal(!showModal);
  };

  const checkFavorites = async () => {
    const userId = localStorage.getItem("user_id");
    const response = await fetch(
      `https://learnify-api-c1uk.onrender.com/flashcards/favorite/user/${userId}/`
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
        category={category}
      />
      <div className={styles["flashcards"]}>
        <div className={styles["container"]}>
          <h1 className={styles["title"]}>{`${category} Flashcards`}</h1>
          <div className={styles["content"]}>
            <div className={styles["options"]} role="flashcards">
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
              {flashcards.length > 0 ? flashcards.map((f) => {
                return (
                  <Flashcard
                    key={f.card_id}
                    f={f}
                    favourites={favourites}
                    setFavourites={setFavourites}
                    getData={getData}
                  />
                );
              }) : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
