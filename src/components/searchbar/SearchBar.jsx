import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-full flex items-center gap-2 md:px-4 px-2 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Notes....."
        className="w-full text-s bg-transparent md:py-[13px] py-[8px] outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose className="text-slate-500 text-xl cursor-pointer hover:text-black mr-3"
        onClick={onClearSearch} />
      )}
      <FaMagnifyingGlass
        className="text-slate-500 text-xl cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
