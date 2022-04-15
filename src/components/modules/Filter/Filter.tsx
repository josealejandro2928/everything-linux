
import React, { useState } from 'react';
import "./Filter.scss"
import DataTypesSelector from './components/DataTypesSelector/DataTypesSelector';
import { Select, Switch, Text, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../store/reducers';
import { setAvoidFiles, setSelectdFileTypes, setHiddenFiles, setLevels, setHighLight } from '../../../store/actions/settings.actions';
import { QuestionMark } from 'tabler-icons-react';
import usePersistData from '../../../hooks/usePersistData';
import AvoidFilesSelector from './components/AvoidFilesSelector/AvoidFilesSelector';

const Filters = () => {

    const selectedFileTypes = useSelector((state: State) => state.settings.selectedFileTypes);
    const hiddenFiles = usePersistData(useSelector((state: State) => state.settings.hiddenFiles), { key: 'hiddenFiles' });
    const levels = usePersistData(useSelector((state: State) => state.settings.levels), { key: 'levels' });
    const avoidFiles = usePersistData(useSelector((state: State) => state.settings.avoidFiles), { key: 'avoidFiles' });
    const showHighLight = usePersistData(useSelector((state: State) => state.settings.showHighLight), { key: 'showHighLight' })
    const dispatch = useDispatch();

    return <div className='Filters'>

        <div className='setting-item'>
            <Text size='sm' style={{ 'marginBottom': '.5rem' }}>
                Include hidden files in the rearch
            </Text>
            <div className='_icon'>
                <Tooltip label={`Files starting with '.' will not be consider`}>
                    <QuestionMark />
                </Tooltip>
            </div>
            <Switch checked={hiddenFiles}
                onChange={(event) => (dispatch(setHiddenFiles(event.currentTarget.checked)))} />
        </div>
        <br />

        <div className='setting-item'>
            <Text size='sm' style={{ 'marginBottom': '.5rem' }}>
                Select an specific file types:
            </Text>
            <div className='_icon'>
                <Tooltip label={'To make a more complex filter, you can find a group of files by the extension.'}>
                    <QuestionMark />
                </Tooltip>
            </div>

            <DataTypesSelector selectedFileTypes={selectedFileTypes}
                setSelectedFileTypes={(data: any) => dispatch(setSelectdFileTypes(data))}></DataTypesSelector>
        </div>

        <br />

        <div className='setting-item'>
            <Text size='sm' style={{ 'marginBottom': '.5rem' }}>
                Select name of files to not consider:
            </Text>
            <div className='_icon'>
                <Tooltip label={'Files with these names will not be considered in the search.'}>
                    <QuestionMark />
                </Tooltip>
            </div>

            <AvoidFilesSelector selectedAvoidFiles={avoidFiles} setSelectedAvoidFiles={(data: any) => (dispatch(setAvoidFiles(data)))} />

        </div>
        <br />

        <div className='setting-item'>
            <Text size='sm' style={{ 'marginBottom': '.5rem' }}>
                Set the deep of the search:
            </Text>
            <div className='_icon'>
                <Tooltip label={'This sets how deep you are going to search in the hierarchy tree of your file system.'}>
                    <QuestionMark />
                </Tooltip>
            </div>

            <Select
                value={levels + ''}
                placeholder="Pick one"
                onChange={(e) => (dispatch(setLevels(+(e as any))))}
                data={[
                    { value: '0', label: 'Full' },
                    { value: '2', label: '2 levels' },
                    { value: '4', label: '4 levels' },
                    { value: '8', label: '8 levels' },
                    { value: '16', label: '16 levels' },
                    { value: '32', label: '32 levels' },
                ]}
            />

        </div>
        <br />
        <div className='setting-item'>
            <Text size='sm' style={{ 'marginBottom': '.5rem' }}>
                Highlights the match in the results
            </Text>
            {/* <div className='_icon'>
                <Tooltip label={`Files starting with '.' will not be consider`}>
                    <QuestionMark />
                </Tooltip>
            </div> */}
            <Switch checked={showHighLight} onChange={(event) => (dispatch(setHighLight(event.currentTarget.checked)))} />
        </div>

    </div>

}

export default Filters

