import React, { useMemo } from 'react';
import { ActionIcon, Slider, useMantineColorScheme, Group, Text } from '@mantine/core';
import './Footer.scss'
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../store/reducers';
import { setTextSize } from '../../../store/actions/search.actions';

function Footer() {
    const { colorScheme } = useMantineColorScheme();
    const dispatch = useDispatch()
    const textSize = useSelector((state: State) => state.search.textSize);

    const value = useMemo(() => {
        if (textSize == 'xs') return 0;
        if (textSize == 'sm') return 25;
        if (textSize == 'md') return 50;
        if (textSize == 'lg') return 75;
        if (textSize == 'xl') return 100;
    }, [textSize])

    function onSetTextSize(val: number) {
        let newVal: any = 'xs';
        if (val == 0) newVal = 'xs';
        if (val == 25) newVal = 'sm';
        if (val == 50) newVal = 'md';
        if (val == 75) newVal = 'lg';
        if (val == 100) newVal = 'xl';
        dispatch(setTextSize(newVal));
    }

    return (
        <div className={colorScheme == 'dark' ? 'Footer dark' : 'Footer light'}>
            <div style={{ width: '100px' }}>
                <Text size='xs' style={{ marginBottom: '4px' }}>
                    Font size:
                </Text>
                <Slider value={value}
                    onChange={(val) => onSetTextSize(val)}
                    size="sm"
                    step={25}
                    marks={[
                        { value: 0, },
                        { value: 25, },
                        { value: 50, },
                        { value: 75, },
                        { value: 100, },
                    ]}
                />
            </div>


        </div>
    );
}

export default Footer