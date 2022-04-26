import React, { useState } from 'react';

import { Button, Drawer, Grid, useMantineColorScheme } from "@mantine/core"
import "./Toolbar.scss"
import { Menu2 } from 'tabler-icons-react';
import RootDirectory from '../../modules/RootDirectory/RootDirectory';
import SearchInput from '../../modules/SearchInput/SearchInput';
import Settings from '../../modules/Settings/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../store/reducers';
import { setOptions } from '../../../store/actions/search.actions';
import { isObjectEquals } from '../../../functions';


const Toolbar = () => {
    const { colorScheme } = useMantineColorScheme();
    const [openedDrawer, setOpenedDrawer] = useState(false);
    const settings = useSelector((state: State) => state.settings);
    const options = useSelector((state: State) => state.search.options);
    const dispatch = useDispatch();

    const onUpdateOprions = () => {
        let newSettings: any = { ...settings };
        let newOptions: any = { ...options };

        delete newSettings.showHighLight;
        delete newOptions.matchCase;
        delete newOptions.matchExaclyWord;
        delete newOptions.regularExpression;


        if (!isObjectEquals(newSettings, newOptions))
            dispatch(setOptions({ ...newSettings }));

    }

    return <React.Fragment>
        <div className={colorScheme == 'dark' ? 'Toolbar dark' : 'Toolbar light'}>
            <Grid style={{ margin: '0px' }}>
                <Grid.Col style={{
                    display: 'flex', alignItems: 'center', borderRight: `1px solid ${'rgba(255, 255, 255, .2)'}`,
                    padding: '4px 16px'
                }} span={8}>
                    <SearchInput />
                </Grid.Col>

                <Grid.Col style={{
                    display: 'flex', alignItems: 'center',
                    borderRight: `1px solid ${'rgba(255, 255, 255, .2)'}`,
                    padding: '4px 16px',
                    maxWidth: '28%'
                }}>
                    <RootDirectory />
                </Grid.Col>
                <Grid.Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', maxWidth:'60px' }} >
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
                onClose={() => {
                    setOpenedDrawer(false)
                    onUpdateOprions();
                }}
                title="Settings"
                padding="md"
                size="md"
                position="right"
            >
                <Settings />
            </Drawer>
        </div>
        <div style={{ 'height': '64px' }}></div>
    </React.Fragment>
}

export default Toolbar