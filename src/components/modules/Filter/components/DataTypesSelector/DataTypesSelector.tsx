
import React from 'react';
import "./DataTypesSelector.scss"
import { MultiSelect } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

const defaultFileTypes = [
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'music', label: 'Music' },
]

const DataTypesSelector = ({ selectedFileTypes, setSelectedFileTypes }:
    {
        selectedFileTypes: Array<string>,
        setSelectedFileTypes: Function
    }) => {

    const [fileTypes, setFileTypes] = useLocalStorage<Array<any>>({ key: 'file-types', defaultValue: defaultFileTypes });

    return <div className='DataTypesSelector'>
        <MultiSelect
            value={selectedFileTypes}
            onChange={(e) => setSelectedFileTypes(e)}
            data={fileTypes}
            placeholder="Pick all that you like"
        />
    </div>

}

export default DataTypesSelector

