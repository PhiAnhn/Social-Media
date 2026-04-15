import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";
import { useLayoutEffect, useRef, useMemo } from "react";   // ← bỏ useState
import InfiniteScroll from "react-infinite-scroll-component";

const ChatWindowBody = () => {
    const {
        activeConversationId,
        conversations,
        messages: allMessages,
        fetchMessages,
    } = useChatStore();

    // Derived values
    const selectedConvo = conversations.find((c) => c._id === activeConversationId);
    const messages = allMessages[activeConversationId!]?.items ?? [];
    const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;

    // Tính lastMessageStatus từ selectedConvo (không cần useState)
    const lastMessageStatus = useMemo<"delivered" | "seen">(() => {
        const seenBy = selectedConvo?.seenBy ?? [];
        return seenBy.length > 0 ? "seen" : "delivered";
    }, [selectedConvo?.seenBy]);   // chỉ phụ thuộc vào seenBy

    const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

    const key = `chat-scroll-${activeConversationId}`;

    // refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cuộn xuống dưới khi chuyển conversation
    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, [activeConversationId]);

    // Fetch thêm tin nhắn
    const fetchMoreMessages = async () => {
        if (!activeConversationId) return;
        try {
            await fetchMessages(activeConversationId);
        } catch (error) {
            console.error("Lỗi fetch thêm tin nhắn:", error);
        }
    };

    // Lưu vị trí scroll
    const handleScrollSave = () => {
        const container = containerRef.current;
        if (!container || !activeConversationId) return;

        sessionStorage.setItem(
            key,
            JSON.stringify({
                scrollTop: container.scrollTop,
                scrollHeight: container.scrollHeight,
            })
        );
    };

    // Khôi phục vị trí scroll khi messages thay đổi
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const saved = sessionStorage.getItem(key);
        if (saved) {
            try {
                const { scrollTop } = JSON.parse(saved);
                requestAnimationFrame(() => {
                    container.scrollTop = scrollTop;
                });
            } catch (e) {
                console.error("Lỗi parse scroll position", e);
            }
        }
    }, [messages.length, key]);

    // ================== RENDER ==================
    if (!selectedConvo) {
        return <ChatWelcomeScreen />;
    }

    if (messages.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                Chưa có tin nhắn nào trong cuộc trò chuyện này.
            </div>
        );
    }

    return (
        <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
            <div
                id="scrollableDiv"
                ref={containerRef}
                onScroll={handleScrollSave}
                className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar"
            >
                <div ref={messagesEndRef} />

                <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchMoreMessages}
                    hasMore={hasMore}
                    scrollableTarget="scrollableDiv"
                    loader={<p className="text-center py-4">Đang tải thêm...</p>}
                    inverse={true}
                    style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        overflow: "visible",
                    }}
                >
                    {reversedMessages.map((message, index) => (
                        <MessageItem
                            key={message._id ?? index}
                            message={message}
                            index={index}
                            messages={reversedMessages}
                            selectedConvo={selectedConvo}
                            lastMessageStatus={lastMessageStatus}   // ← giờ ổn định
                        />
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default ChatWindowBody;