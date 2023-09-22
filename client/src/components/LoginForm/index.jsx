import { NavLink } from "react-router-dom";
import styles from "./index.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuth } = useAuth();

  const login = async (e) => {
    e.preventDefault();
    const data = { username, password };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const res = await fetch(`https://learnify-api-c1uk.onrender.com/users/login`, options);
    const { token, authenticated, user_id } = await res.json();
    if (res.ok) {
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      setAuth(authenticated);
      navigate("/dashboard");
    } else {
      setError("Incorrect username or password. Please try again.");
    }
  };

  return (
    <div className={styles["form"]}>
      <div className={styles["form-heading"]}>
        <h1>Login</h1>
      </div>
      <form role="form" onSubmit={login}>
        <div className={styles["input"]} role="username">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <span>Username</span>
        </div>
        <div className={styles["input"]}>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span>Password</span>
        </div>
        <div className={styles["input"]}>
          <button className={`${styles["btn"]}`} type="submit">
            Submit
          </button>
        </div>
        {error && <p className={styles["error-message"]}>{error}</p>}
        <p>Forgot Password</p>
        <NavLink className={styles["redirect-signup"]} to="/signup">
          Don't have an account yet? Sign Up
        </NavLink>
      </form>
    </div>
  );
}
