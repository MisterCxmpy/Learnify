import { NavLink, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useState } from "react";

export default function SignupForm() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const signup = async (e) => {
    e.preventDefault()

    const data = { username, email, password };

    if (password !== conPassword) return;

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const res = await fetch(`https://learnify-api-c1uk.onrender.com/users/register`, options);
    
    if (res.ok) {
      navigate("/login")
    } else {
      setErrorMessage("Username is not available");
    }
  }

  return (
    <div className={styles["form"]}>
      <div className={styles["form-heading"]}>
        <h1>Sign up</h1>
      </div>
      <form role='form' onSubmit={signup}>
        <div className={styles["input"]}>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={12} required />
          <span>Username</span>
        </div>
        <div className={styles["input"]}>
          <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <span>Email</span>
        </div>
        <div className={styles["input"]}>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <span>Password</span>
        </div>
        <div className={styles["input"]}>
          <input type="password" id="conPassword" value={conPassword} onChange={(e) => setConPassword(e.target.value)} required />
          <span>Confirm Password</span>
        </div>
      {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}

        <div className={styles["input"]}>
          <button className={styles["btn"]} type="submit" role='submit'>Submit</button>
        </div>
        <NavLink className={styles["redirect-login"]} to="/login">Already have an account? Sign in</NavLink>
      </form>
    </div>
  );
}
