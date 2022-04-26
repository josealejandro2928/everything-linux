import { ActionIcon, Grid, Group, Modal, ScrollArea, Select, Text, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { IFile, SelectedDirectoriesItem } from '../../../models/file.model';
import { Edit, Trash } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../store/reducers';
import { setSearchDirectory } from '../../../store/actions/search.actions';
const { ipcRenderer } = window.require('electron');





const RootDirectory = () => {
    const [rootDirFiles, setRootDirFiles] = useLocalStorage<Array<IFile>>({ key: 'root-dir', defaultValue: [] });
    const directory = useSelector((state: State) => state.search.directory);
    const dispatch = useDispatch();
    const data = useRef<Array<SelectedDirectoriesItem<IFile>>>([]);
    const [opened, setOpened] = useState(false);


    useEffect(() => {
        if (rootDirFiles.length) return;
        ipcRenderer.send("root-dir");
        ipcRenderer.on("root-dir-result", (_: any, data: { data: Array<IFile> }) => {
            setRootDirFiles(data?.data || [])
        })
    }, [])

    useEffect(() => {
        data.current = rootDirFiles.map((el) => {
            return {
                label: el.path,
                value: el.path,
                description: el.name,
                image: el.icon,
                selectedDirectory: directory,
                allFiles: rootDirFiles,
                setRootDirFiles: setRootDirFiles

            } as any;
        })

    }, [rootDirFiles])

    function onSetNewDirectory(newDirectory: string) {
        dispatch(setSearchDirectory(newDirectory));
    }

    function onDeleteItem(el: IFile) {
        setRootDirFiles(rootDirFiles.filter(item => (item.path !== el.path)));
    }


    return <>

        <Grid style={{ margin: '0px', width: '100%' }} >
            <Grid.Col style={{
                display: 'flex', alignItems: 'center', gap: '.25rem'
            }} span={12}>
                <Select
                    value={directory}
                    onChange={onSetNewDirectory}
                    itemComponent={SelectItem}
                    style={{ width: '100%' }}
                    placeholder="Root Directory"
                    searchable
                    nothingFound="No options"
                    data={data.current}
                />
                <Tooltip label="Directories selections">
                    <ActionIcon size="md" onClick={() => setOpened(true)}  >
                        <Edit size={14} />
                    </ActionIcon>
                </Tooltip>

            </Grid.Col >
        </Grid>

        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Edit the directories selection"
        >
            <ScrollArea style={{ height: '500px', width: '100%' }}>


                {rootDirFiles.map((el) => (
                    <Group key={el.path} noWrap style={{
                        justifyContent: 'space-between',
                        padding: '.5rem 1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, .1)'
                    }} >
                        <Group style={{ flex: 1 }}>
                            <img height={30} src={el.icon} />
                            <div>
                                <Text lineClamp={1} size="sm">{el.name}</Text>
                                <Text lineClamp={1} size="xs" color="dimmed">
                                    {el.path}
                                </Text>
                            </div>
                        </Group>

                        {(directory !== el.path && el.path !== '/' && el.path !== '/home'
                        ) && (
                            <Tooltip label="Delete this path directory">
                                <ActionIcon onClick={() => { onDeleteItem(el) }} size="md" color="red"   >
                                    <Trash size={14} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                ))}
            </ScrollArea>

        </Modal>
    </>

}

const SelectItem = forwardRef<HTMLDivElement, SelectedDirectoriesItem<IFile>>(
    ({ image,
        label,
        description,
        selectedDirectory,
        allFiles,
        setRootDirFiles,
        ...others }: SelectedDirectoriesItem<IFile>, ref) => {


        function onDeleteDirectory(e: any) {
            e.stopPropagation();
            console.log(others.value);

        }

        return (<div ref={ref} {...others}>
            <Group noWrap >
                <img height={30} src={image} />
                <div>
                    <Text lineClamp={1} size="sm">{description}</Text>
                    <Text lineClamp={1} size="xs" color="dimmed">
                        {label}
                    </Text>
                </div>
            </Group>
        </div>)
    }
);


export default RootDirectory;