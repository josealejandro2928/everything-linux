import { Grid, Group, Select, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import React, { forwardRef, useEffect } from 'react';
import { IFile } from '../../../models/file.model';
import { Folder } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../store/reducers';
import { setSearchDirectory } from '../../../store/actions/search.actions';
const { ipcRenderer } = window.require('electron');




const RootDirectory = () => {
    const [rootDirFiles, setRootDirFiles] = useLocalStorage<Array<IFile>>({ key: 'root-dir', defaultValue: [] });
    const directory = useSelector((state: State) => state.search.directory);
    const dispatch = useDispatch();


    useEffect(() => {
        ipcRenderer.send("root-dir");
        ipcRenderer.on("root-dir-result", (_: any, data: { data: Array<IFile> }) => {
            setRootDirFiles(data?.data || [])
        })
    }, [])

    const data = rootDirFiles.map((el) => {
        return {
            label: el.path,
            value: el.path,
            description: el.name,
            image: el.isDirectory ? <Folder /> : ''
        }
    })

    function onSetNewDirectory(newDirectory: string) {
        dispatch(setSearchDirectory(newDirectory));
    }


    return (
        <Grid style={{ margin: '0px', width: '100%' }} >
            <Grid.Col style={{
                display: 'flex', alignItems: 'center'
            }} span={12}>
                <Select
                    value={directory}
                    onChange={onSetNewDirectory}
                    itemComponent={SelectItem}
                    style={{ width: '100%' }}
                    placeholder="Root Directory"
                    searchable
                    nothingFound="No options"
                    data={data}
                />
            </Grid.Col >

        </Grid>)
}

const SelectItem = forwardRef<HTMLDivElement, any>(
    ({ image, label, description, ...others }: any, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                {image}
                <div>
                    <Text size="sm">{description}</Text>
                    <Text size="xs" color="dimmed">
                        {label}
                    </Text>
                </div>
            </Group>
        </div>
    )
);


export default RootDirectory;