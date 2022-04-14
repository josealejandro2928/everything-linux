
import React, { useState } from 'react';
import "./Filter.scss"
import DataTypesSelector from './components/DataTypesSelector/DataTypesSelector';
import { Chip, Chips, MultiSelect, Text, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../store/reducers';
import { setAvoidFiles, setSelectdFileTypes } from '../../../store/actions/settings.actions';
import { QuestionMark } from 'tabler-icons-react';
import usePersistData from '../../../hooks/usePersistData';
import AvoidFilesSelector from './components/AvoidFilesSelector/AvoidFilesSelector';

const Filters = () => {

    const selectedFileTypes = useSelector((state: State) => state.settings.selectedFileTypes);
    const avoidFiles = usePersistData(useSelector((state: State) => state.settings.avoidFiles), { key: 'avoidFiles' });
    const dispatch = useDispatch();

    return <div className='Filters'>

        <div className='setting-item'>
            <Text size='sm' style={{ 'marginBottom': '.5rem' }}>
                Select an specific file types:
            </Text>
            <div className='_icon'>
                <Tooltip label={'To make a more complex filter, you can find a group of files by the extension.'}>
                    <QuestionMark color='#fff' />
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
                    <QuestionMark color='#fff' />
                </Tooltip>
            </div>

            <AvoidFilesSelector selectedAvoidFiles={avoidFiles} setSelectedAvoidFiles={(data: any) => (dispatch(setAvoidFiles(data)))} />

        </div>

    </div>

}

export default Filters

