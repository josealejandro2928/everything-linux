
import React, { useEffect } from 'react';
import "./DataTypesSelector.scss"
import { MultiSelect } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

const defaultFileTypes = [
    { value: 'image', label: 'Images files' },
    { value: 'video', label: 'Videos files' },
    { value: 'audio', label: 'Audios files' },
    { value: 'compressed', label: 'Compressed files' },
    { value: 'disc', label: 'Disc files' },
    { value: 'database', label: 'Database files' },
    { value: 'programming', label: 'Programming files' },
    { value: 'executable', label: 'Executable files' },
    { value: 'presentation', label: 'Presentation files' },
    { value: 'spreadsheet', label: 'Spreadsheet files' },
    { value: 'word-processor-pdf', label: 'Word Processor and Pdf files' },

]

const DataTypesSelector = ({ selectedFileTypes, setSelectedFileTypes }:
    {
        selectedFileTypes: Array<string>,
        setSelectedFileTypes: Function
    }) => {

    const [fileTypes, setFileTypes] = useLocalStorage<Array<any>>({ key: 'file-types', defaultValue: [] });

    useEffect(() => {
        setFileTypes(defaultFileTypes);
    }, [])

    return <div className='DataTypesSelector'>
        <MultiSelect
            searchable
            value={selectedFileTypes}
            onChange={(e) => setSelectedFileTypes(e)}
            data={fileTypes}
            placeholder="Pick all that you like"
        />
    </div>

}

export default DataTypesSelector

