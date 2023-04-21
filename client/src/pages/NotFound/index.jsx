import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import error from "../../public/images/error.png";

const NotFound = () => {
  return (
    <div className={styles["main"]}>
      <div className={styles["error-container"]}>
        <img src={error} className={styles["image"]} />
        <div className={styles["options"]}>
          <div className={styles["messages"]}>
            <h1 className={styles["h1"]}>OOPS! PAGE NOT FOUND.</h1>
            <p className={styles["message"]}>
              I bet you're feeling like this sad face right about now, unable to
              find what you were looking for. That link must have led us to a room
              full of outdated tech and malfunctioning equipment, because I can't
              seem to find the page you've been looking for.
            </p>
          </div>
          <Link to="/dashboard" className={styles["btn"]}>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
