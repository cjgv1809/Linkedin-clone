import React, { useState } from "react";
import "./Login.css";
import { auth, provider } from "../firebase";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import LinkedinLogo from "../images/login-logo.svg";
import LoginHero from "../images/login-hero.svg";
import GoogleLogo from "../images/google.svg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const dispatch = useDispatch();

  const loginToApp = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userAuth) => {
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            profileUrl: userAuth.user.photoURL,
          })
        );
      })
      .catch((error) => alert(error.message));
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    auth
      .signInWithPopup(provider)
      .then((userAuth) => {
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            profileUrl: userAuth.user.photoURL,
          })
        );
      })
      .catch((error) => alert(error.message));
  };

  const register = (e) => {
    if (!name) {
      return alert("Please enter a full name!");
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userAuth) => {
        userAuth.user
          .updateProfile({
            displayName: name,
            photoURL: profilePic,
          })
          .then(() => {
            dispatch(
              login({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
                displayName: name,
                photoURL: profilePic,
              })
            );
          });
      })
      .catch((error) => alert(error));
  };

  return (
    <div className="login">
      <img src={LinkedinLogo} alt="Linkedin Logo" />
      <button className="login__joinNow">Join Now</button>
      <button className="login__signIn" onClick={signInWithGoogle}>
        Sign In
      </button>
      <div className="login__formContainer">
        <form>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name (required)"
            type="text"
          />
          <input
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            placeholder="Profile pic URL (Optional)"
            type="text"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (required)"
            type="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (required)"
            type="password"
          />
          <button
            type="submit"
            onClick={loginToApp}
            className={
              !name || !email || !password
                ? "login__button--disabled"
                : "login__button"
            }
          >
            Sign In
          </button>
          <p>
            Not a member?{" "}
            <span className="login__register" onClick={register}>
              Register Now
            </span>
          </p>
          <h3>OR</h3>
          <div className="login__buttonGoogle" onClick={signInWithGoogle}>
            <img src={GoogleLogo} alt="" />
            Sign in with Google
          </div>
        </form>
        <div className="login__heroImg">
          <p>Welcome to your professional community</p>
          <img src={LoginHero} alt="Login Hero Background" />
        </div>
      </div>
    </div>
  );
}

export default Login;
