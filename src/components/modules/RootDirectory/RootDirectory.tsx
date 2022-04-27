import { ActionIcon, Grid, Group, Modal, ScrollArea, Select, Text, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { forwardRef, useEffect, useRef, useState, useTransition } from 'react';
import { IFile, SelectedDirectoriesItem } from '../../../models/file.model';
import { Edit, Trash, Upload } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchDirectory } from '../../../store/actions/search.actions';
import { State } from '../../../store/models/index.state';
const { ipcRenderer } = window.require('electron');

const RootDirectory = () => {
    const [rootDirFiles, setRootDirFiles] = useLocalStorage<Array<IFile>>({ key: 'root-dir', defaultValue: [] });
    const directory = useSelector((state: State) => state.search.directory);
    const dispatch = useDispatch();
    const data = useRef<Array<SelectedDirectoriesItem<IFile>>>([]);
    const [opened, setOpened] = useState(false);
    const [remount, setRemount] = useState(true);

    useEffect(() => {
        if (rootDirFiles.length) return;
        ipcRenderer.send("root-dir");
        ipcRenderer.on("root-dir-result", (_: any, data: { data: Array<IFile> }) => {
            setRootDirFiles(data?.data || [])
        })
    }, [])

    useEffect(() => {
        ipcRenderer.on("open-dialog-response", (_: any, data: Array<IFile>) => {
            updateRootDir(data);
        })
    }, [])

    useEffect(() => {
        setRemount(false);
        data.current = rootDirFiles.map((el) => {
            return {
                label: el.path,
                value: el.path,
                description: el.name,
                image: el.icon,
            } as any;
        })
        const t = setTimeout(() => { setRemount(true); clearTimeout(t) }, 100);

    }, [rootDirFiles])

    function updateRootDir(newDirFiles: Array<IFile>) {
        let values: Array<IFile> = JSON.parse(localStorage.getItem('root-dir') || '[]');
        for (let newEl of newDirFiles) {
            if (values.findIndex(el => (el.path == newEl.path)) > -1) continue;
            values.push(newEl);
        }
        values = values.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        setRootDirFiles(values);
    }

    function onSetNewDirectory(newDirectory: string) {
        dispatch(setSearchDirectory(newDirectory));
    }

    function onDeleteItem(el: IFile) {
        setRootDirFiles(rootDirFiles.filter(item => (item.path !== el.path)));
    }

    function onOpenDirectories() {
        ipcRenderer.send("open-dialog");
    }


    return <>

        <Grid style={{ margin: '0px', width: '100%' }} >
            <Grid.Col style={{
                display: 'flex', alignItems: 'center', gap: '.25rem'
            }} span={12}>
                {remount && <Select
                    value={directory}
                    onChange={onSetNewDirectory}
                    itemComponent={SelectItem}
                    style={{ width: '100%' }}
                    placeholder="Root Directory"
                    searchable
                    nothingFound="No options"
                    data={data.current}
                />}

                <Tooltip label="Edit Directories Selection">
                    <ActionIcon size="md" onClick={() => setOpened(true)}  >
                        <Edit size={14} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Add More Directories">
                    <ActionIcon size="md" onClick={onOpenDirectories}  >
                        <Upload size={14} />
                    </ActionIcon>
                </Tooltip>

            </Grid.Col >
        </Grid>

        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Edit Directories Selection"
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
                                <Text lineClamp={1} size="md">{el.name}</Text>
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

const SelectItem = forwardRef<HTMLDivElement, any>(
    ({ image,
        label,
        description,
        ...others }: any, ref) => {
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