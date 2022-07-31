import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { ConversationContext } from "../../../shared/context/current-conversation-context";
import Button from "../../../shared/FormElements/Button";
import ImageUpload from "../../../shared/FormElements/ImageUpload";
import useHttpClient from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import Modal from "../../../shared/UIElements/Modal";
import styles from "./MessagesFooter.module.css";

const MessagesFooter = (props) => {
    const [messageIsValid, setMessageIsValid] = useState(false);
    const [inputMessage, setInputMessage] = useState();
    const [image, setImage] = useState({
        previewUrl: null,
        file: null,
        valid: false,
    });

    const { error, clearError, sendRequest } = useHttpClient();

    const conversationCtx = useContext(ConversationContext);
    const authCtx = useContext(AuthContext);
    const conversationId = conversationCtx.conversationId;

    useEffect(() => {
        setInputMessage("");
        setMessageIsValid(false);
    }, [conversationId]);

    const messageInputHandler = (event) => {
        const input = event.target.value;
        setInputMessage(input);
        if (input.trim().length > 0) {
            setMessageIsValid(true);
        } else {
            setMessageIsValid(false);
        }
    };

    const imagePickHandler = useCallback((previewUrl, file, valid) => {
        setImage({ previewUrl, file, valid });
    }, []);

    const cancelImageSend = () => {
        setImage({ previewUrl: null, file: null, valid: false });
    };

    const messageSendHandler = async () => {
        setInputMessage("");
        setMessageIsValid(false);
        props.onMessageSend("clicked");

        try {
            const formData = new FormData();

            if (!!image.file && !!image.previewUrl && image.valid) {
                formData.append("sender", authCtx.userId);
                formData.append("party2Id", conversationCtx.party2Id);
                formData.append("image", image.file);
            } else if (!!inputMessage) {
                formData.append("message", inputMessage);
                formData.append("sender", authCtx.userId);
                formData.append("party2Id", conversationCtx.party2Id);
            } else {
                return;
            }
            await sendRequest(
                "http://localhost:8080/api/chat/conversation/" +
                    conversationCtx.conversationId,
                "PATCH",
                formData,
                {
                    Authorization: "Bearer " + authCtx.token,
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Fragment>
            <Modal
                className="center"
                style={{ backgroundColor: "aliceblue" }}
                show={!!image.previewUrl}
                onCancel={cancelImageSend}
            >
                <div className={`${styles["image-preview"]}`}>
                    <img
                        src={image.previewUrl}
                        alt="Preview"
                    />
                </div>
                <Button onClick={cancelImageSend}>Cancel</Button>
                <Button onClick={messageSendHandler}>Send</Button>
            </Modal>
            <ErrorModal error={error} onClear={clearError} />
            <div className={styles["messages-footer"]}>
                <div className={styles["messages-input"]}>
                    <ImageUpload id="imagePicker" onPick={imagePickHandler} />
                    <textarea
                        name="messageInput"
                        id="messageInput"
                        placeholder="Type your message here"
                        cols={30}
                        rows={2}
                        value={inputMessage}
                        onInput={messageInputHandler}
                    />
                </div>
                {messageIsValid && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-send"
                        viewBox="0 0 16 16"
                        onClick={messageSendHandler}
                    >
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
                    </svg>
                )}
            </div>
        </Fragment>
    );
};

export default MessagesFooter;
