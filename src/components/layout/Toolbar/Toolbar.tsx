import React, { useState } from 'react';

import { Button, Drawer, Grid, useMantineColorScheme } from "@mantine/core"
import "./Toolbar.scss"
import { Menu2 } from 'tabler-icons-react';
import RootDirectory from '../../modules/RootDirectory/RootDirectory';
import SearchInput from '../../modules/SearchInput/SearchInput';


const Toolbar = () => {
    const { colorScheme } = useMantineColorScheme();
    const [openedDrawer, setOpenedDrawer] = useState(false);


    return <React.Fragment>
        <div className={colorScheme == 'dark' ? 'Toolbar dark' : 'Toolbar light'}>
            <Grid style={{ margin: '0px' }}>
                <Grid.Col style={{
                    display: 'flex', alignItems: 'center', borderRight: `1px solid ${'rgba(255, 255, 255, .2)'}`,
                    padding: '4px 16px'
                }} span={8}>
                    <SearchInput />
                    {/* <div className='divider'></div> */}
                </Grid.Col>

                <Grid.Col style={{
                    display: 'flex', alignItems: 'center',
                    borderRight: `1px solid ${'rgba(255, 255, 255, .2)'}`,
                    padding: '4px 16px'
                }} span={3}>
                    <RootDirectory />
                </Grid.Col>
                <Grid.Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} span={1}>
                    <Button onClick={() => (setOpenedDrawer(true))} variant={colorScheme == 'dark' ? 'subtle' : 'filled'}
                        color={colorScheme == 'dark' ? 'blue' : ''}
                        style={{ color: '#fff', padding: '6px' }}>
                        <Menu2 />
                    </Button>
                    {/* <ToogleTheme /> */}
                </Grid.Col>
            </Grid>
            <Drawer
                opened={openedDrawer}
                onClose={() => setOpenedDrawer(false)}
                title="Filters"
                padding="md"
                size="md"
                position="right"
            >
                {/* Drawer content */}
            </Drawer>
        </div>
        <div style={{ 'height': '64px' }}></div>
    </React.Fragment>
}

export default Toolbar