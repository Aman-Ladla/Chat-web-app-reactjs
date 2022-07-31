import React, { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { ConversationContext } from "../../../shared/context/current-conversation-context";
import useHttpClient from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import styles from "./NewConversation.module.css";

const NewConversation = (props) => {
    const [filteredUsers, setFilteredUsers] = useState([]);

    const newUserInput = props.newUserInput;

    const { token } = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const conversationCtx = useContext(ConversationContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resData = await sendRequest(
                    `http://localhost:8080/api/auth/users/${newUserInput}`,
                    undefined,
                    undefined,
                    {
                        Authorization: "Bearer " + token,
                    }
                );

                setFilteredUsers(resData.users);
            } catch (error) {
                console.log(error);
            }
        };

        const timer = setTimeout(() => {
            if (newUserInput.length > 0) {
                fetchUsers();
            } else {
                setFilteredUsers([]);
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [newUserInput, sendRequest, token]);

    const newConversationHandler = async function () {
        try {
            const resData = await sendRequest(
                "http://localhost:8080/api/chat/newConversationId",
                undefined,
                undefined,
                {
                    Authorization: "Bearer " + token,
                }
            );
            const conversationId = resData.newId;
            conversationCtx.setConversation(
                this.name,
                conversationId,
                this.party2Id
            );
        } catch (error) {}

        props.onClick();
    };

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearError} />

            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && (
                <div className={styles["new-conversation"]}>
                    {filteredUsers.length > 0 &&
                        filteredUsers.map((user) => {
                            return (
                                <div
                                    key={user.email}
                                    className={styles["filter-user"]}
                                    onClick={newConversationHandler.bind({
                                        name: user.name,
                                        party2Id: user._id,
                                    })}
                                >
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
                                </div>
                            );
                        })}
                </div>
            )}
        </Fragment>
    );
};

export default NewConversation;
