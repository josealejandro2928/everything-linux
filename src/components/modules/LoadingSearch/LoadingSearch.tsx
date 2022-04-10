import { Dialog, Text, Group, Loader, Button, CloseButton, Tooltip } from '@mantine/core';
import React, { memo } from 'react';
import { Menu2 } from 'tabler-icons-react';

const LoadingSearch = memo(({ opened = false, setOpened = () => { } }:
    { opened: boolean; setOpened: Function }) => {
    return <div>
        <Dialog
            style={{ padding: '16px 16px' }}
            opened={opened}
            size="sm"
            radius="md"
        >


            <Group position="apart" align="center">
                <Loader size="sm" />
                <Text size="sm" weight={500}>
                    Searching...
                </Text>
                <Tooltip label="Stop the current search">
                    <CloseButton onClick={() => setOpened()} />
                </Tooltip>
            </Group>
        </Dialog>
    </div>



})

export default LoadingSearch