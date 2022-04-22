
import React, { useEffect } from 'react';
import TabContainer, { TabItem } from 'tabs-react-component';
import Filter from '../Filter/Filter'
import 'tabs-react-component/dist/index.css'
import './Settings.scss';
import { ScrollArea } from '@mantine/core';

const Settings = () => {

    useEffect(() => {
        const drawerHeader = document.querySelector('.mantine-Drawer-header');
        if (!drawerHeader) return;
        drawerHeader.remove();
    }, [])

    return (
        <div className='Settings'>
            <ScrollArea style={{ height: '95vh', width: '100%' }}>
                <TabContainer color='rgb(25, 113, 194)' borderLine >
                    <TabItem name='Filters'>
                        <div style={{ padding: '1rem 0.5rem' }}>
                            <Filter />
                        </div>
                    </TabItem>
                    <TabItem name='Settings'>
                        <h3>Content2</h3>
                    </TabItem>
                </TabContainer>
            </ScrollArea>

        </div>)


}

export default Settings

