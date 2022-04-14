
import React, { useEffect } from 'react';
import TabContainer, { TabItem } from 'tabs-react-component';
import 'tabs-react-component/dist/index.css'
import './Settings.scss';

const Settings = () => {

    useEffect(() => {
        const drawerHeader = document.querySelector('.mantine-Drawer-header');
        if (!drawerHeader) return;
        drawerHeader.remove();
    }, [])

    return (
        <div className='Settings'>
            <TabContainer color='rgb(25, 113, 194)' borderLine >
                <TabItem name='Filters'>
                    <h3>Content1</h3>
                </TabItem>
                <TabItem name='Settings'>
                    <h3>Content2</h3>
                </TabItem>
            </TabContainer>
        </div>)


}

export default Settings

