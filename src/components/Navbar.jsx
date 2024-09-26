import React, { useState } from "react";
import SearchBar from "./searchbar/SearchBar";
import ProfileInfo from "./cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios"; // Make sure Axios is imported
import { toast } from "react-toastify";
import { FiMenu } from "react-icons/fi";
import {
  signInFailure,
  signInsuccess,
  signoutFailure,
  signoutStart,
} from "../redux/userSlice/userSlice";
import logo from "../public/img/logo.png";

function Navbar({ userInfo, handleClearSearch, onSearchNote }) {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };
  const OnLogout = async () => {
    try {
      dispatch(signoutStart());

      const res = await axios.get("/api/auth/signout", {
        withCredentials: true,
      });

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      dispatch(signInsuccess());
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <>
      <div className="container mx-auto bg-[#9f9e9e] flex items-center justify-between fixed w-full z-50 md:px-6 px-2 py-4 drop-shadow md:gap-0 gap-1">
        <div className="md:w-1/3 w-1/5 flex justify-center">
          <Link to={"/"}>
            <img
              src={logo}
              alt="logo"
              className="lg:w-[40%] md:w-[60%] w-[100%]"
            />
          </Link>
        </div>
        <div className="md:w-1/3 w-2/5 ">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>
        <div className="md:w-1/3 w-1/5">
          <ProfileInfo userInfo={userInfo} OnLogout={OnLogout} />
        </div>
      </div>
    </>
  );
}

export default Navbar;
