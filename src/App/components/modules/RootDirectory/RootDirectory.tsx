import { Grid, Select } from '@mantine/core';
import React from 'react';

const RootDirectory = () => {
    return (
        <Grid style={{ margin: '0px', width: '100%' }} >
            <Grid.Col style={{
                display: 'flex', alignItems: 'center'
            }} span={12}>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Root Directory"
                    searchable
                    nothingFound="No options"
                    data={['React', 'Angular', 'Svelte', 'Vue']}
                />
            </Grid.Col >

        </Grid>)
}

export default RootDirectory;