import React from "react";
import Toolbar from "../modules/Toolbar/Toolbar";

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] | any }) => {
 
    return <React.Fragment>

        <Toolbar />
        {children}
    </React.Fragment>

}

export default Layout;