import React from "react";
import { useState } from "react";
import Passwordinput from "../../components/input/Passwordinput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import {
  signInFailure,
  signInStart,
  signInsuccess,
} from "../../redux/userSlice/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("please enter a valid email address");
      return;
    }
    if (!password) {
      setError("please enter the password");
      return;
    }
    setError("");
    //login api

    try {
      dispatch(signInStart());

      const res = await axios.post(
        "/api/auth/signin",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        console.log(res.data);
        dispatch(signInFailure(data.message));
      }
      toast.success(res.data.message);
      dispatch(signInsuccess(res.data));
      navigate("/");
    } catch (error) {
      toast.error(res.message);
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <div className="container flex items-center justify-center h-screen">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form action="" onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7 ">Login</h4>

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
              LOGIN
            </button>

            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link
                to={"/signup"}
                className="font-medium text-[#2B85EF] underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
