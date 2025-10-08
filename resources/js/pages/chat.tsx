import { useState, useEffect } from "react";
import Pusher from "pusher-js";

export default function Chat({role}) {
  const [username, setUsername] = useState("Nama User");
  const [chat, setChat] = useState([]);      // untuk daftar chat
  const [message, setMessage] = useState(""); // untuk input message

  useEffect(() => {
    // Enable pusher logging - jangan include ini di production
    Pusher.logToConsole = true;

    const pusher = new Pusher("6ace5906628421242d73", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      // tambahkan pesan baru ke state
      setChat((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        message,
      }),
    });

    setMessage(""); // kosongkan input
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#BBDCE5] p-5">
      {/* Header */}
      <div className="fixed top-0 left-0 flex items-center gap-5 w-full h-[91px] px-10 py-3 backdrop-blur-md bg-white/30 z-10">
        <img src="/user.png" alt="pp" className="w-[60px] h-[60px]" />
        <p className="text-[36px]">{username}</p>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col items-center justify-center w-full h-[900px] pt-[110px] px-5">
        <div className="flex flex-col w-full gap-5 pt-[120px] px-5 pb-[120px] overflow-y-auto">
          {chat.map((c, i) =>
            c.sender === "me" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[60%] bg-[#9BC0E6] text-black px-5 py-3 rounded-2xl rounded-tr-sm shadow">
                  <p className="text-[20px]">{c.message}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-3">
                <img
                  src="/user.png"
                  alt="user"
                  className="w-12 h-12 rounded-full"
                />
                <div className="max-w-[60%] bg-white text-black px-5 py-3 rounded-2xl rounded-tl-sm shadow">
                  <p className="text-[20px]">{c.message}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Input Chat */}
      <form
        onSubmit={submit}
        className="flex fixed bottom-5 justify-start items-center px-10 w-[1325px] h-[97px] bg-white rounded-3xl"
      >
        <div className="flex justify-between items-center w-full gap-5">
          <input
            type="text"
            placeholder="Write your message.........."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex justify-center items-center border-0 focus:outline-none text-[36px] placeholder:text-[36px] w-full h-[100px]"
          />
          <button
            type="submit"
            className="flex justify-center items-center bg-[#BBDCE5] w-[80px] h-[80px] rounded-2xl cursor-pointer"
          >
            <img
              src="/send.png"
              alt="send"
              className="w-[50px] h-[50px] cursor-pointer"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
