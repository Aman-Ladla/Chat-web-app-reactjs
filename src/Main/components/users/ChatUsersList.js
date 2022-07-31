import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import openSocket from "socket.io-client";
import { AuthContext } from "../../../shared/context/auth-context";
import useHttpClient from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import ChatUser from "./ChatUser";
import styles from "./ChatUsersList.module.css";

const ChatUsersList = (props) => {
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [conversations, setConversations] = useState([]);

    const { error, sendRequest, clearError } = useHttpClient();

    const authCtx = useContext(AuthContext);

    const { token } = authCtx;

    const userId = authCtx.userId;

    const { userSearchQuery } = props;

    useEffect(() => {
        setFilteredUsers(
            conversations.filter((user) =>
                user.name
                    .toLowerCase()
                    .includes(userSearchQuery.toLowerCase().trim())
            )
        );
    }, [userSearchQuery, conversations]);

    const fetchingConversations = useCallback(async () => {
        try {
            const resData = await sendRequest(
                "http://localhost:8080/api/chat/conversations/" + userId,
                undefined,
                undefined,
                {
                    Authorization: "Bearer " + token,
                }
            );
            setConversations(resData.conversations);
        } catch (error) {
            console.log(error);
        }
    }, [sendRequest, userId, token]);

    useEffect(() => {
        const socket = openSocket("http://localhost:8080");
        socket.on("newConversation" + userId, (data) => {
            if (data.action === "create") {
                fetchingConversations();
            }
        });
    }, [fetchingConversations, userId]);

    useEffect(() => {
        fetchingConversations();
    }, [fetchingConversations]);

    return (
        <Fragment>
            {error && <ErrorModal error={error} onClear={clearError} />}
            <div className={styles["user-list"]}>
                {filteredUsers.map((user) => (
                    <ChatUser
                        key={user.name}
                        name={user.name}
                        conversationId={user.conversationId}
                        party2Id={user.party2Id}
                        chatId={user.chatId}
                        onToggle={props.onToggle}
                    />
                ))}
            </div>
        </Fragment>
    );
};

export default ChatUsersList;
