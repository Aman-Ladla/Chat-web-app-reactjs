import React, {
    createRef,
    Fragment,
    useContext,
    useEffect,
    useState,
} from "react";
import openSocket from "socket.io-client";
import { AuthContext } from "../../../shared/context/auth-context";
import { ConversationContext } from "../../../shared/context/current-conversation-context";
import useHttpClient from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import Message from "./Message";
import styles from "./Messages.module.css";

const Messages = (props) => {
    const MESSAGES_DIV_REF = createRef();

    const { onMessageSend, sendButtonValue } = props;

    const { sendRequest, error, clearError } = useHttpClient();

    const [isOverflowing, setIsOverFlowing] = useState(true);

    const [startingChatChunkNumber, setStartingChatChunkNumber] = useState();

    const [scrollHeight, setScrollHeight] = useState();

    const [scrollHeightPrevious, setScrollHeightPrevious] = useState();

    const [messFetchingPhase, setMessFetchingPhase] = useState("start");

    const [chatMessages, setChatMessages] = useState([]);

    const [prevChatLoading, setPrevChatLoading] = useState(false);

    const authCtx = useContext(AuthContext);

    const { token } = authCtx;

    const conversationCtx = useContext(ConversationContext);

    const conversationId = conversationCtx.conversationId;

    if (!!MESSAGES_DIV_REF.current) {
        if (scrollHeight !== MESSAGES_DIV_REF.current.scrollHeight) {
            setScrollHeight(MESSAGES_DIV_REF.current.scrollHeight);
        }
    }

    const fetchPreviousMessages = async () => {
        setPrevChatLoading(true);
        const resData = await sendRequest(
            "http://localhost:8080/api/chat/conversation/previousChat/" +
                conversationId +
                "?packetNo=" +
                (startingChatChunkNumber - 1),
            undefined,
            undefined,
            {
                Authorization: "Bearer " + token,
            }
        );
        setStartingChatChunkNumber((prev) => prev - 1);
        setScrollHeightPrevious(scrollHeight);
        setChatMessages((prev) => [...resData.messages, ...prev]);
        setMessFetchingPhase("previousMessage");
    };

    const scrollHandler = () => {
        if (MESSAGES_DIV_REF.current.scrollTop === 0) {
            if (startingChatChunkNumber < 1) {
                return;
            }
            fetchPreviousMessages();
        }
    };

    useEffect(() => {
        setScrollHeight(MESSAGES_DIV_REF.current.scrollHeight);
    }, [MESSAGES_DIV_REF]);

    useEffect(() => {
        const fetchInitialChat = async () => {
            try {
                const resData = await sendRequest(
                    "http://localhost:8080/api/chat/conversation/" +
                        conversationId,
                    undefined,
                    undefined,
                    {
                        Authorization: "Bearer " + token,
                    }
                );
                setChatMessages(resData.messages);
                setStartingChatChunkNumber(resData.startChatChunkNum);
            } catch (error) {
                console.log(error);
            }
        };
        fetchInitialChat();
    }, [conversationId, sendRequest, token]);

    useEffect(() => {
        const socket = openSocket("http://localhost:8080");
        socket.on("message" + conversationId, (data) => {
            if (data.action === "create") {
                setChatMessages((prev) => [...prev, data.message]);
                onMessageSend("unclicked");
                setMessFetchingPhase("newMessage");
            }
        });
    }, [conversationId, onMessageSend]);

    useEffect(() => {
        if (scrollHeight <= MESSAGES_DIV_REF.current.clientHeight) {
            setIsOverFlowing(false);
        } else {
            if (
                messFetchingPhase === "start" ||
                messFetchingPhase === "newMessage"
            ) {
                MESSAGES_DIV_REF.current.scrollTo(0, scrollHeight);
            } else if (messFetchingPhase === "previousMessage") {
                MESSAGES_DIV_REF.current.scrollTo(
                    0,
                    scrollHeight - scrollHeightPrevious
                );
                setPrevChatLoading(false);
            }
        }
    }, [
        scrollHeight,
        scrollHeightPrevious,
        MESSAGES_DIV_REF,
        messFetchingPhase,
    ]);

    return (
        <Fragment>
            {error && <ErrorModal error={error} onClear={clearError} />}
            <div
                className={
                    styles.messages +
                    " " +
                    (!isOverflowing && styles["messages-not-overflow"])
                }
                onScroll={scrollHandler}
                ref={MESSAGES_DIV_REF}
            >
                {prevChatLoading && <LoadingSpinner asOverlay />}
                {chatMessages.map((message) => (
                    <Message key={message._id} message={message} />
                ))}
                {sendButtonValue === "clicked" && <LoadingSpinner asOverlay />}
            </div>
        </Fragment>
    );
};

export default Messages;
