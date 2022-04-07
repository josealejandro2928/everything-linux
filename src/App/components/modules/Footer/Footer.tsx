import React from 'react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import './Footer.scss'

function Footer() {
    const { colorScheme } = useMantineColorScheme();

    return (
        <div className={colorScheme == 'dark' ? 'Footer dark' : 'Footer light'}>

        </div>
    );
}

export default Footer