import React from "react";
import Toolbar from "../Toolbar/Toolbar";
import "./Layout.scss";

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] | any }) => {

    return <React.Fragment>

        <Toolbar />
        {children}
    </React.Fragment>

}

export default Layout;