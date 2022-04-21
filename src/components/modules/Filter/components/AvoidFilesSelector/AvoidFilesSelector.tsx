
import React from 'react';
import { MultiSelect } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

const defaultAvoidFiles = [
    'node_modules',
    'env',
    '$Recycle.Bin',
    'Windows',
    '__pycache__',
    '$RECYCLE.BIN',
]

const AvoidFilesSelector = ({ selectedAvoidFiles, setSelectedAvoidFiles }:
    {
        selectedAvoidFiles: Array<string>,
        setSelectedAvoidFiles: Function
    }) => {

    const [totalAvoidFiles, seTotalAvoidFiles] = useLocalStorage<Array<any>>({ key: 'total-avoid-files', defaultValue: defaultAvoidFiles });

    return (
        <MultiSelect
            value={selectedAvoidFiles}
            data={totalAvoidFiles}
            placeholder="Select files"
            searchable
            maxSelectedValues={20}
            creatable
            onChange={(e) => setSelectedAvoidFiles(e)}
            getCreateLabel={(query: any) => `+ Create ${query}`}
            onCreate={(query) => { seTotalAvoidFiles([...totalAvoidFiles, query]) }}
        />
    )


}

export default AvoidFilesSelector

