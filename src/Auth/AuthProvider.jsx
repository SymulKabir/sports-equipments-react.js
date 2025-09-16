import React, { useState, createContext, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../shared/constants/variables/metadata";
import { getCookie, setCookie, removeCookie } from "../shared/functions/cookies";

// const auth = getAuth(app);
const auth = () => {};
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin(getCookie());
  }, []);

  const checkLogin = async (token) => {
    if (user?.name || !token) {
      return;
    }
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/user/check-login`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // pass token in header
        },
      });

      const data = await response.json();
      if (response.ok && data.data) {
        setUser(data.data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Check login error:", err);
    }finally{
      setLoading(false)
    }
  };

  const createNewUser = async (name, photo, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, photo, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        setUser(data.data);
        setCookie(data.token);

        toast.success("Account created successfully!");
      } else {
        toast.error(`Error: ${data.error || "Failed to create user"}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok && data.data) {
        setUser(data.data);
        setCookie(data.token);
        toast.success("Account login successfully!");
      } else {
        toast.error(`Error: ${data.error || "Failed to get user"}`);
      }
    } catch (error) {
      // console.error("Login error:", error.message);
      toast.error("Please input valid email or password");
    } finally {
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      toast.success("Google login successful!");
    } catch (error) {
      console.error("Error during Google login:", error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const logout =  () => {
     removeCookie()
     setUser(null)
  };

  const authInfo = {
    user,
    setUser,
    createNewUser,
    login,
    logout,
    loading,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
