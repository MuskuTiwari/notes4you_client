import React, { useEffect, useState } from "react";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const { currentUser, loading, errorDispatch } = useSelector(
    (state) => state.user
  );

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    if (currentUser === null || !currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser?.rest);
      getAllNotes();
    }
  }, []);

  //get all notes

  const getAllNotes = async () => {
    try {
      const res = await axios.get("/api/note/all", {
        withCredentials: true,
      });
      if (res.data.success === false) {
        console.log(res.data);
        return;
      }
      setAllNotes(res.data.notes);
    } catch (error) {}
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  //delete note
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const res = await axios.delete("/api/note/delete/" + noteId, {
        withCredentials: true,
      });
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast(error.message);
    }
  };
  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("/api/note/search", {
        params: { query },
        withCredentials: true,
      });
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      setIsSearch(true);
      setAllNotes(res.data.notes);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const res = await axios.put(
        "/api/note/update-Note-Pinned/" + noteId,
        { isPinned: !noteData.isPinned },
        { withCredentials: true }
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        console.log(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="container mx-auto h-screen overflow-y-auto scroll-smooth">
        <Navbar
          userInfo={userInfo}
          onSearchNote={onSearchNote}
          handleClearSearch={handleClearSearch}
        />
        <div className="container mx-auto h-screen md:px-4 px-2 lg:py-[60px] md:py-14 py-6 mt-10">
          {allNotes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 mt-4">
              {allNotes.map((note, index) => (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={note.createdAt}
                  content={note.content}
                  tags={note.tags}
                  isPinned={note.isPinned}
                  onEdit={() => {
                    handleEdit(note);
                  }}
                  onDelete={() => {
                    deleteNote(note);
                  }}
                  onPinNote={() => {
                    updateIsPinned(note);
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyCard
              imgSrc={
                isSearch
                  ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAxAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAgMEBQEGB//EADkQAAICAQIDBQUGBQQDAAAAAAECAAMRBBIhMVEFE0FSYRQiMpHRQnGBocHwIzNicrEGQ9LhJGN0/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AP3GIiAiJ4c+ED2VXXpTs3599wgwPEzPTqnTUHTaoAWHjUw5WD6+kdpcfZP/AKU/WBtiIgIkSwHMiN6+YQJRI718wjevmECUSO9fMI3r5hAlEjvXzCN6+YQJRI718wjevUQJRPAc8sYnsBERAREQEREBERA8Mi1iIcO6g+pxJyq3TUXEG2lHIGAWXMCnUrptTWa7LE9CHGQfAiTTT7qal1Dm1q2DB8YyRyMDQ6QEEaarh/QI1dtlSoKU3M7qvoATxJ/CBYbU7wpvXcBkrniB1lPtlL1O9V1bhPiIbgPvllVFNLs1dQDOcswHEz16UNZVUUA+GIGD2mpk73vkKA4LbuAM8OooFYsNybGOA2eHzljVBfdKKB0xznmxMAbVwOQxAg+opQKXuQBuKknGZ699KOEe1A54gE8TJFEOMqpx6QVUnJUE9cQIi6vvO67xO88uePylh9fwkdq5ztGeuJQNmiRy9jGpmBXcM7OvHpA0xAIwOIOR4cogIiIE6nKuuDw8ZtmOmss2TyE2QEREBERAREQEREBETxmCjJ5QPGdV5n8Jk1GofvKe5B295/E4fZwZ47FiSfGUXpY7UlDgK+W48xgwN/tC9DHtC9DMsQNJ1C+IM879PKZniBo79PKY9oTymZ5RZq6VO0Pvby1gsfygb/aE6GDdWwIK5B5ic/2ojlp9QR9w+se2V/7i21jqyHHzGYGpbnTUgBAdOV4YGChH6S7v08pnPu231oarkwLFOQ3Dnymg84Gjv08pjv08pmeIGkahehj2hOhmaIG5WDfCZKYFYhsg4m1G3KCIEoiICIiAiIgJXqP5Rlk8YbhiBglOorDPSS4BWwEAnnwPCXupViJn1IrL0F2wwsygxzODAviIgJC61KkLOT0AAyWPSSZgilmOFHEn0makjc2r1AxwzWDyRYEjS9q7tYxRD/tIf8me13ZG3QabeByZQAvzPD5SzT6Q6oi/VD3DxWo+Pq30nRAC8AOA8BAwBO0Tx/hD07w/SRZtbX/No3r4mtg35HBnRLheDED8Y4cxA4b1Uapi6AI6n7PAg+o+stqvYOKrgAx+FwODfQzoarSJf72Stg+FxzH1nNZSxfT6hcOOe3kw8CP3zga4mfS2N71Vpy6fa8w8DNEBERATXpv5SzKi7zhZtVdowIEoiICIiAiIgIiIEWRWHvCY9VTSLKN+/JtwmPA4M3TNq3VbNOGrDlrcA+U4PGBXZWazx4r1kPum9gGGCJgIxkfKBm1nvGqnPBzlv7Rz/SWADVa1K8fwq1DEengP8/KVWcde/wDTUMfiT9Jr7LALal//AGbfwAH/AHA3CYe2tVbpNC1lCk2E4Bxnb6zfPCAeYzA+S0nZOu7Qr9otu255GwnjJdm6vUdndojS3szIWCspOcdCJ3e0u0qOz1UOrMzDKqs4Gjqv7V7VGpKFaw+WbpjwgfXTF2nTmjvkBL0+8MeI8RNsQOHa2w1Xq2QpAJ6q37E2eOOk56p/4D1eUOnyJH6TbU2+qtjzZQfygWopc4A++XjTr4kyWnXFS9TLYEVRUHASURAREQEREBERAREQEz6p2SygIobdZhiRyGDxlj3Ivjk+ky36iwvT3SHbv9/l8ODA2M21SZhJkntaznwHSRgZH4a5v6ql/In6ibOyiAdSnS3d+BA/7mTWDYargPgbDf2n9iTqs9n1SWHgjgVv6dP8wOvE8BE9gcP/AFHob9XZp2or34yD6TtVoErVQAMDHCcD/UOt1tGqRKHeuvGQVHxGdrRvbZpanuXbYygsOhgXweUTD2ndto7pDh7cqCPsjxPygc4WAaOy7wZXf5kn9ZspXu6kTyqB+Uy2qGNWmQcCQSP6V8PyAm08zA16dspjpLZgVmQ5U4/WXpqAfiGIGiJFWDDIORJQEREBERAREQEo1FmMKOfjL5iv42tAhx8ZVejs1RVsKrgt72OGDLZC2tba2rcZVhgwJjpEoZL66q0oZLCvM3E/hynth1O5e6Wnbw3Fic+uOECxwrKVYZB4ETIgKltNdhuHuk/bWaCdR3wAWnuc8SSd3+MSt6rb2KXisV5O1kY716HlAt0urOnxVqmJTklp8PRvrOmCCMg5E4Ya6lNusThjHeIMqfv6SVSlFzpbmrXw2HcvyMDskA8xnpwnuZyxqdYBjvaD6mo/8p41mqfg+ox6Vpt+pgbtTq66Bj4rCPdReZ+k5jMVL6jUMO8YeHJR0H74yO6qolawXsPMLxJ+8zHrfaUtV7cKOaAcQD69TA6OmrbjbauHbkvlXp9/WaMYnMPbOnTYHDBj8WOSzpA7lDA5B6QPYiIEkYo2QfvmxTuGZhmvTnNQgWxEQEREBERATLqUIO7w8ZqnjAEEGBgiXNpzn3eXqZHubPLAriT7mzyx3NnlgQiT7mzyx3NnlgQlD6Shm3bNrdUO0/lNXc2eWO5s8sDH7J01F4H9w+k99jrPB3ts9Hc4+QwJr7mzyx3NnlgVVolS4rRVA8AJg7cNq6TFa5GffPQTqdzZ5YNDspVkyDwIPjA+Q0OoSm1hcgemwbbBjjjqPUTraS06K5NPY5s0lvGm7P5TD2v2a+gtDDPct8J6HpIaLU1mttHq8+zueD+NZ6j9YH0/jEwdn22V3nQ6k5sUZrfPB1nTFFnQfOBWOJwOc21LsQCRrqCHcectgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIFWpor1FLU2rlGGJ8V2jobNBqDVYMqfgbwYfWfdTL2joq9dpzU/A81bxUwPka9YG0govDl6ve09i80PQnpPpexO0TrtOQ/C6vG/19Z8vZ2dq69R3HcOz54ELkH1n0/YfZp0FTta2bbMbgOQx4QOpERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERA//2Q=="
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwu29RvqhlANfBZlUhn2_GegaTWGQIv5VyD94QnMVxQ1Lz04qp-umTBHZgsQ&s"
              }
              message={
                isSearch
                  ? "Oops! No notes found matching your search"
                  : `Ready to capture your ideas? click the 'Add' button to startnoting down yor thoughts, inspiration and reminders. Let's get started!`
              }
            />
          )}
        </div>
        <button
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#343536] hover:bg-[#252627] absolute right-10 bottom-10 "
          onClick={() => {
            setOpenAddEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>
        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
          contentLabel=""
          className="lg:w-2/4 w-3/4 h-[430px] bg-white rounded-md mx-auto my-[110px] p-5 overflow-scroll"
        >
          <AddEditNotes
            onclose={() =>
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }
            noteData={openAddEditModal.data}
            type={openAddEditModal.type}
            getAllNotes={getAllNotes}
          />
        </Modal>
      </div>
    </>
  );
};

export default Home;
