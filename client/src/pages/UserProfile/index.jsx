import styles from "./index.module.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UpdateDetailsForm, ProfileImg, UpdatePasswordForm } from "../../components";

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [toggleDetailsForm, setToggleDetailsForm] = useState(false)
  const [togglePasswordForm, setTogglePasswordForm] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const userId = localStorage.getItem('user_id');

      const response = await fetch(`https://learnify-api-c1uk.onrender.com/users/username/single/${userId}`, {
        
      });
      const data = await response.json();
      setUser(data);
    }

    fetchUser();
  }, [userId]);

  const openDetailsForm = () => {
    setToggleDetailsForm(!toggleDetailsForm)
    setTogglePasswordForm(false)
  }

  const openPasswordForm = () => {
    setTogglePasswordForm(!togglePasswordForm)
    setToggleDetailsForm(false)
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={`${styles["details-form"]} ${styles[toggleDetailsForm ? 'open' : 'closed']}`} role='update-details'>
          <button className={styles["exit-btn"]} onClick={openDetailsForm}>x</button>
          <UpdateDetailsForm user={user} />
        </div>
        <div className={`${styles["password-form"]} ${styles[togglePasswordForm ? 'open' : 'closed']}`}>
          <button className={styles["exit-btn"]} onClick={openPasswordForm}>x</button>
          <UpdatePasswordForm user={user} />
        </div>
      <div className={styles["profile"]}>
        <div className={styles["userProfile"]}>
          <div className={styles["profile-details"]}>  
            <ProfileImg />
            <h1 className={styles.username} role='headingone'>{user?.username}</h1>
            <p className={styles.email} role='email'>Email: {user?.email}</p>
          </div>
          <div className={styles["profile-score"]}>
            <h2>Stats:</h2>
            <p className={styles.highscore} role='points'> Total XP: {user?.score}</p>
            <p className={styles.highscore} role='percentage'>Average accuracy: {user?.score_out_of == 0 ? 0 : Math.round((user?.score/user?.score_out_of) * 100)}%</p>
            <p className={styles.highscore}>Total quizzes played: {Math.floor(user?.score_out_of / 10)}</p>
          </div>
          <div className={styles["options"]}>
          <button className={`${styles["form-btn"]} ${styles["btn"]}`} onClick={openDetailsForm}>Update your details</button>
          <button className={`${styles["password-form-btn"]} ${styles["btn"]}`} onClick={openPasswordForm}>Update your password</button>
          </div>
        </div>  
        
      </div>
    </>
  );
}
