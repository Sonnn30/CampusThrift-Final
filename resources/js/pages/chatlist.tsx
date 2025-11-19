import { usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import useTranslation from "@/Hooks/useTranslation";

interface Conversation {
    id: number;
    other_user: {
        id: number;
        name: string;
        email: string;
    };
    last_message: {
        text: string;
        time: string;
        created_at: string;
    } | null;
    unread_count: number;
    updated_at: string;
}

interface ChatListProps {
    role: string;
    conversations: Conversation[];
    [key: string]: any;
}

export default function ChatList() {
    const { role, conversations } = usePage<ChatListProps>().props;

    const getLocale = () => {
        const path = window.location.pathname;
        const match = path.match(/^\/([a-z]{2})\//);
        return match ? match[1] : 'id';
    };

    const openChat = (userId: number) => {
        const locale = getLocale();
        window.location.href = `/${locale}/${role}/chat/${userId}`;
    };

    const {t} = useTranslation()

    return (
        <div className="w-full min-h-screen bg-[#ECEEDF] py-10 px-6">
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('Messages')}</h1>
                <p className="text-gray-600">{t('Your')}</p>
            </div>

            {/* Chat List */}
            <div className="max-w-5xl mx-auto space-y-4">
                {conversations && conversations.length > 0 ? (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => openChat(conv.other_user.id)}
                            className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200"
                        >
                            <div className="flex items-center gap-5">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <img
                                        src="/user.png"
                                        alt={conv.other_user.name}
                                        className="w-16 h-16 rounded-full border-2 border-gray-200"
                                    />
                                    {conv.unread_count > 0 && (
                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                            {conv.unread_count > 9 ? '9+' : conv.unread_count}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                                            {conv.other_user.name}
                                        </h3>
                                        {conv.last_message && (
                                            <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                                                {t(conv.last_message.time)}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                                        {conv.last_message?.text || t("NoMessages")}
                                    </p>
                                </div>

                                {/* Arrow Icon */}
                                <div className="flex-shrink-0">
                                    <svg
                                        className="w-6 h-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full bg-white rounded-2xl p-10 text-center shadow-sm">
                        <div className="flex flex-col items-center gap-4">
                            <svg
                                className="w-16 h-16 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {t('NoMessages')}
                                </h3>
                                <p className="text-gray-500">
                                    Start chatting with {role === "Buyer" ? "sellers" : "buyers"} from products or transactions
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
