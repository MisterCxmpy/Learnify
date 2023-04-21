import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { LandingNav, SideNav } from "./layouts";
import ProtectedRoute from "./routes/ProtectedRoute";
import {
  Landing,
  Login,
  Signup,
  Dashboard,
  Quizzes,
  Flashcards,
  FlashcardsList,
  FlashcardsActivity,
  UserProfile,
  Logout,
  QuestionsPage,
  NotFound
} from "./pages";
import { Shapes } from "./components";
import { useAuth } from "./context/AuthContext";
import { useCategory } from "./context/CategoryContext";

export default function App() {
  const { setAuth } = useAuth();
  const { setCategory } = useCategory()

  useEffect(() => {
    if (localStorage.getItem("token")) setAuth(true)
  }, [])

  useEffect(() => {
    setCategory([
      {
        geography: {
          name: 'Geography',
          image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        },
        history: {
          name: 'History',
          image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80'
        },
        chemistry: {
          name: 'Chemistry',
          image: 'https://images.unsplash.com/photo-1608037222022-62649819f8aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
        },
        biology: {
          name: 'Biology',
          image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
        },
        physics: {
          name: 'Physics',
          image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
        },
        mathematics: {
          name: 'Maths',
          image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80'
        },
        english: {
          name: 'English Literature',
          image: 'https://images.unsplash.com/photo-1583361704493-d4d4d1b1d70a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80'
        },
        sports: {
          name: 'Sports Science',
          image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        },
        religiouseducation: {
          name: 'Religious Education',
          image: 'https://images.unsplash.com/photo-1624862761959-18b9c810825d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        }
      }
    ])
  }, [])

  return (
    <>
      <Shapes />
      <Routes>
        <Route path="/" element={<LandingNav />}>
          <Route index element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<SideNav />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard/quizzes" element={<Quizzes />} />
            <Route path="/dashboard/quizzes/:subject" element={<QuestionsPage />} />
            <Route path="/dashboard/flashcards" element={<Flashcards />} />
            <Route path="/dashboard/flashcards/:category" element={<FlashcardsList />} />
            <Route path="/dashboard/flashcards/:category/activity" element={<FlashcardsActivity />} />
            <Route path="/dashboard/userprofile" element={<UserProfile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
}
