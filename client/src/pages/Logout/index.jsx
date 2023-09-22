import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function index() {

  const {setAuth} = useAuth()
  const navigate = useNavigate()

  const logout = async () => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: localStorage.getItem("token") }),
    };

    const res = await fetch(`https://learnify-api-c1uk.onrender.com/users/logout`, options);
    
    if (res.ok) {
      localStorage.clear()
      setAuth(false)
      navigate("/")
    } else {
      console.log("Something failed, very sad! :(");
    }
  }

  useEffect(() => {
    logout()
  }, [])
  
}
