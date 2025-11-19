import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Pusher from "pusher-js";
import axios from "axios";
import useTranslation from "@/Hooks/useTranslation";

interface Message {
  id: number;
  message: string;
  sender: 'me' | 'other';
  sender_name: string;
  created_at: string;
}

interface Recipient {
  id: number;
  name: string;
  email: string;
}

interface ChatProps {
  role: string;
  conversation_id: number;
  recipient: Recipient;
  messages: Message[];
  [key: string]: any;
}

export default function Chat({ role }: { role: string }) {
  const { conversation_id, recipient, messages: initialMessages } = usePage<ChatProps>().props;

  const [chat, setChat] = useState<Message[]>(initialMessages || []);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Enable pusher logging - jangan include ini di production
    Pusher.logToConsole = true;

    const pusher = new Pusher("6ace5906628421242d73", {
      cluster: "ap1",
    });

    // Subscribe ke channel khusus conversation ini
    const channel = pusher.subscribe(`chat.${conversation_id}`);
    channel.bind("message", function (data: any) {
      // tambahkan pesan baru ke state
      const newMessage: Message = {
        id: data.id,
        message: data.message,
        sender: data.sender_id === recipient.id ? 'other' : 'me',
        sender_name: data.sender_name,
        created_at: data.created_at || new Date().toISOString(),
      };

      setChat((prev) => [...prev, newMessage]);
    });

    return () => {
      pusher.unsubscribe(`chat.${conversation_id}`);
    };
  }, [conversation_id, recipient.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await axios.post("/api/messages", {
        conversation_id,
        message,
      });

      console.log("Message sent successfully:", response.data);
      setMessage(""); // kosongkan input
    } catch (error: any) {
      console.error("Error sending message:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Gagal mengirim pesan";
      alert(errorMsg);
    }
  };

  const {t} = useTranslation()

  return (
    <div className="w-full h-screen flex flex-col bg-[#BBDCE5] overflow-hidden">
      {/* Header - Fixed Top */}
      <div className="fixed top-0 left-0 right-0 flex items-center gap-3 sm:gap-5 w-full h-[70px] sm:h-[80px] lg:h-[91px] px-4 sm:px-6 lg:px-10 py-2 sm:py-3 backdrop-blur-md bg-white/30 shadow-md z-20">
        <img
          src="/user.png"
          alt="pp"
          className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] lg:w-[60px] lg:h-[60px] rounded-full border-2 border-white shadow"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xl sm:text-2xl lg:text-[36px] font-semibold truncate">
            {recipient?.name || "User"}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Online</p>
        </div>
        {/* Back Button (Mobile) */}
        <button
          onClick={() => window.history.back()}
          className="lg:hidden p-2 hover:bg-white/50 rounded-full transition-colors"
          title="Back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Chat Area - Scrollable */}
      <div className="flex-1 overflow-y-auto pt-[70px] sm:pt-[80px] lg:pt-[91px] pb-[90px] sm:pb-[100px] lg:pb-[120px]">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
            {chat.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm sm:text-base">{t('NoMessages')}</p>
              </div>
            )}

            {chat.map((c, i) =>
              c.sender === "me" ? (
                <div key={i} className="flex justify-end animate-fadeIn">
                  <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] bg-[#9BC0E6] text-black px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-2xl rounded-tr-sm shadow-md">
                    <p className="text-sm sm:text-base lg:text-[20px] break-words">{c.message}</p>
                    <span className="text-[10px] sm:text-xs text-gray-600 mt-1 block">
                      {new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2 sm:gap-3 animate-fadeIn">
                  <img
                    src="/user.png"
                    alt="user"
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white shadow flex-shrink-0"
                  />
                  <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] bg-white text-black px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-2xl rounded-tl-sm shadow-md">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                      {c.sender_name}
                    </p>
                    <p className="text-sm sm:text-base lg:text-[20px] break-words">{c.message}</p>
                    <span className="text-[10px] sm:text-xs text-gray-500 mt-1 block">
                      {new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Input Chat - Fixed Bottom */}
      <form
        onSubmit={submit}
        className="fixed bottom-0 left-0 right-0 flex items-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-white border-t border-gray-200 shadow-2xl z-20"
      >
        <div className="flex items-center w-full max-w-[1200px] mx-auto gap-2 sm:gap-3 lg:gap-5">
          {/* Emoji/Attachment Button (Optional) */}
          <button
            type="button"
            className="hidden sm:flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Attach"
          >
            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('Type')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#9BC0E6] focus:border-transparent placeholder:text-gray-400 bg-gray-50"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex-shrink-0 transition-all ${
              message.trim()
                ? 'bg-[#9BC0E6] hover:bg-[#8ab0d5] shadow-md hover:shadow-lg active:scale-95'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            title="Send"
          >
            <img
              src="/send.png"
              alt="send"
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
            />
          </button>
        </div>
      </form>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
