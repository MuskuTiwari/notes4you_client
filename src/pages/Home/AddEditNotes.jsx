import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/input/TagInput";
import axios from "axios";
import { toast } from "react-toastify";

const AddEditNotes = ({ onclose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // edit note
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const res = await axios.post(
        "/api/note/edit/" + noteId,
        { title, content, tags },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      getAllNotes();
      onclose();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setError(error.message);
    }
  };

  //add note
  const addNewNote = async () => {
    try {
      const res = await axios.post(
        "/api/note/add",
        { title, content, tags },
        { withCredentials: true }
      );
      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
      onclose();
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title ");
      return;
    }

    if (!content) {
      setError("Please enter the content ");
      return;
    }

    setError("");

    if (type == "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <>
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
          onClick={onclose}
        >
          <MdClose className="text-xl text-slate-400" />
        </button>
        <div className="flex flex-col gap-2">
          <label className="input-label text-red-400 uppercase">Title</label>

          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="Wake Up at 6 a.m."
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label text-red-400 uppercase">Content</label>
          <textarea
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Content...."
            rows={10}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          >
            {" "}
          </textarea>
        </div>
        <div className="mt-4">
          <label className="input-label text-red-400 uppercase"> tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

        <button
          className="btn-primary text-white font-medium mt-5 p-3 "
          onClick={handleAddNote}
        >
          {type === "edit" ? "UPDATE" : "ADD"}
        </button>
      </div>
    </>
  );
};

export default AddEditNotes;
