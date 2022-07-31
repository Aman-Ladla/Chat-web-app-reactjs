import React, { useEffect, useState } from "react";
import Backdrop from "../components/backdrop/Backdrop";
import Chat from "../components/messages/Chat";
import SideDrawer from "../components/mobile/sideDrawer/SideDrawer";
import Users from "../components/users/Users";
import styles from "./Main.module.css";

const Main = () => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const openSideDrawer = () => {
        setMobileNavOpen((prev) => !prev);
    };

    const closeSideDrawer = () => {
        setMobileNavOpen(false);
    };

    useEffect(() => {
        if (window.innerWidth < 550) {
            setMobileNavOpen(true);
        }
    }, []);

    return (
        <div className={styles.Main}>
            <div className={styles["chat-users"]}>
                <div className={styles["chat-user"]}>
                    <Users onToggle={closeSideDrawer} />
                </div>
            </div>
            <div className={styles["chat-messages"]}>
                {mobileNavOpen && <Backdrop onClick={openSideDrawer} />}
                <SideDrawer
                    onToggle={closeSideDrawer}
                    className={mobileNavOpen && "open"}
                />
                <Chat mobileNavOpen={mobileNavOpen} onToggle={openSideDrawer} />
            </div>
        </div>
    );
};

export default Main;
