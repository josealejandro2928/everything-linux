import { Input, Tooltip } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { Eraser, Search } from 'tabler-icons-react';

const SearchInput = () => {
    const [value, setValue] = useState('');
    const [debounced] = useDebouncedValue(value, 350);

    useEffect(() => {
        console.log("🚀 ~ file: SearchInput.tsx ~ line 13 ~ SearchInput ~ debounced", debounced)
    }, [debounced])

    const clearSection = (
        <Tooltip label="Clear" position="top" placement="end">
            <Eraser size={20} style={{ display: 'block', opacity: 0.6, cursor: 'pointer' }} />
        </Tooltip>
    );

    return <Input value={value}
        onChange={(event: any) => setValue(event.currentTarget.value)}
        icon={<Search />}
        variant={'filled'}
        size="md"
        style={{ width: '100%' }}
        rightSection={clearSection}

        placeholder="Search for normal text or put an regex"
    />
}

export default SearchInput;