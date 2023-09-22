import React, {useState} from "react";
import styles from "./index.module.css";


export default function UpdateDetailsForm({user}) {
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)

    const update = async (e) => {
        e.preventDefault()
    
        const data = { username, email };

        console.log(user.id)

        console.log(username)
        console.log(email)
        console.log(JSON.stringify(data))
    
        const options = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };
    
        const response = await fetch(`https://learnify-api-c1uk.onrender.com/users/${user.id}`, options);
        console.log(response)
        const data2 = await response.json()
        console.log(data2)
        

            
        if (response.ok) {
            console.log("details updated")
            window.location.reload(false)
        } else {
            console.log("Something failed, very sad! :(");
        }
    }

    return(
        <div className={styles["form"]}>
        <div className={styles["form-heading"]}>
          <h1>Update details</h1>
        </div>
        <form role='form' onSubmit={update}>
          <div className={styles["input"]}>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <span>Username</span>
          </div>
          <div className={styles["input"]}>
            <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <span>Email</span>
          </div>
          <div className={styles["input"]}>
            <button className={styles["btn"]} type="submit" role='submit'>Submit</button>
          </div>
        </form>
      </div>
    )

}
