import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Passwordinput from "../../components/input/Passwordinput";
import { validateEmail } from "../../utils/helper";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("please enter your name");
    }

    if (!validateEmail(email)) {
      setError("please enter a valid email address");
      return;
    }
    if (!password) {
      setError("please enter the password");
      return;
    }
    setError("");

    navigate("/login");
    //sign up api

    try {
      const res = await axios.post(
        "/api/auth/signup ",
        { username: name, email, password },
        { withCredentials: true }
      );
      if (res.data.success === false) {
        setError(error.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      setError("");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <div className="container mx-auto flex items-center justify-center h-screen">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form action="" onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7 ">Sign Up</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Passwordinput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

            <button type="submit" className="btn-primary text-white h-11 ">
              SIGN UP
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="font-medium text-[#2B85EF] underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
