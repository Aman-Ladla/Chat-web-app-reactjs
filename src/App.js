import { useCallback, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import Auth from "./Auth/Auth";
import Main from "./Main/pages/Main";
import { AuthContext } from "./shared/context/auth-context";
import { ConversationContext } from "./shared/context/current-conversation-context";

function App() {
    const [userId, setUserId] = useState();
    const [userName, setUserName] = useState();
    const [token, setToken] = useState();
    const [conversationId, setConversationId] = useState();
    const [chatId, setChatId] = useState();
    const [party2Id, setParty2Id] = useState();
    const [conversationName, setConversationName] = useState();

    let routes;

    const login = useCallback((userId, name, token) => {
        setUserId(userId);
        setUserName(name);
        setToken(token);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: userId,
                name: name,
                token: token,
            })
        );
    }, []);

    const logout = useCallback(() => {
        setUserId(null);
        setUserName(null);
        setToken(null);
        setConversationId(null);
        setChatId(null);
        setParty2Id(null);
        setConversationName(null);
        localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!!userData) {
            if (!!userData.userId && !!userData.name && !!userData.token) {
                login(userData.userId, userData.name, userData.token);
            } else {
                logout();
            }
        }
    }, [login, logout]);

    const conversationHandler = (name, conversationId, party2Id, chatId) => {
        setConversationId(conversationId);
        setChatId(chatId);
        setParty2Id(party2Id);
        setConversationName(name);
    };

    if (!token) {
        routes = (
            <Switch>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Redirect to="/auth" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Main />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                login: login,
                logout: logout,
                userId: userId,
                name: userName,
                token: token,
            }}
        >
            <ConversationContext.Provider
                value={{
                    conversationId: conversationId,
                    party2Id: party2Id,
                    name: conversationName,
                    chatId: chatId,
                    setConversation: conversationHandler,
                }}
            >
                <Router>{routes}</Router>
            </ConversationContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
