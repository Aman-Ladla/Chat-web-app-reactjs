import React, { Fragment, useState } from "react";
import Modal from "../../../shared/UIElements/Modal";
import ChatUsersHeader from "./ChatUsersHeader";
import ChatUsersList from "./ChatUsersList";
import NewConversation from "./NewConversation";
import styles from "./NewConversation.module.css";
import NewConversationIcon from "./NewConversationIcon";
import Search from "./Search";

const Users = (props) => {
    const [searchUser, setSearchUser] = useState("");
    const [newUserInput, setNewUserInput] = useState("");

    const [newConversationOpen, setNewConversationOpen] = useState(false);

    const searchInputHandler = (input) => {
        setSearchUser(input);
    };

    const inputHandler = (event) => {
        setNewUserInput(event.target.value);
    };

    const openNewConversationModalHandler = () => {
        props.onToggle();
        setNewConversationOpen(true);
    };

    const closeNewConversationModalHandler = () => {
        setNewConversationOpen(false);
        setNewUserInput("");
    };

    return (
        <Fragment>
            <Modal
                style={{ backgroundColor: "#111b21" }}
                show={newConversationOpen}
                onCancel={closeNewConversationModalHandler}
            >
                <div className={styles["new-conversation"]}>
                    <input
                        type="text"
                        id="new-conversation"
                        placeholder="Please Search for email"
                        onInput={inputHandler}
                        value={newUserInput}
                    />
                </div>
                <NewConversation
                    newUserInput={newUserInput}
                    onClick={closeNewConversationModalHandler}
                />
            </Modal>
            <ChatUsersHeader />
            <Search onInput={searchInputHandler} />
            <ChatUsersList
                userSearchQuery={searchUser}
                onToggle={props.onToggle}
            />
            <NewConversationIcon onClick={openNewConversationModalHandler} />
        </Fragment>
    );
};

export default Users;
