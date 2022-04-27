import { ActionIcon, Input, Tooltip } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eraser, Search, LetterCase, AB, Asterisk } from 'tabler-icons-react';
import { setSearchFile, setOptions } from '../../../store/actions/search.actions';
import { State } from '../../../store/models/index.state';


const SearchInput = () => {
    const [value, setValue] = useState('');
    const [debounced] = useDebouncedValue(value, 350);
    const { matchCase, matchExaclyWord, regularExpression } = useSelector((state: State) => state.search.options);
    const dispatch = useDispatch();
    const [error, setError] = useState<any>(null);


    useEffect(() => {
        if (regularExpression) return;
        setError(null);
        let isBigEnough = value?.trim()?.length >= 2;
        if (isBigEnough || !value)
            dispatch(setSearchFile(debounced));
    }, [debounced])

    function onClear() {
        setValue('');
        if (regularExpression) {
            dispatch(setSearchFile(''));
        }
        setError(null);
    }

    function onToogleMathCase() {
        dispatch(setOptions({ matchCase: !matchCase }));
    }
    function onMatchExaclyWord() {
        dispatch(setOptions({ matchExaclyWord: !matchExaclyWord }));
    }
    function onRegularExpression() {
        dispatch(setOptions({ regularExpression: !regularExpression }));
    }

    function onEnterKeyDown(e: any) {
        if (e.key !== 'Enter' || !regularExpression) return;
        setError(null);
        try {
            new RegExp(value);
        } catch (e) {
            setError(e);
            return;
        }
        let isBigEnough = value?.trim()?.length >= 2;
        if (isBigEnough || !value)
            dispatch(setSearchFile(value));
    }

    const actionSection = (
        <div style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            gap: '.25rem',
            right: '.5rem',
            top: '50%',
            transform: 'translateY(-50%)'
        }}>
            <Tooltip label="Math Case" position="top" placement="end">
                <ActionIcon
                    onClick={onToogleMathCase}
                    variant={matchCase ? 'light' : 'transparent'}
                    color={matchCase ? 'blue' : 'gray'}><LetterCase size={16} /></ActionIcon>
            </Tooltip>
            <Tooltip label="Math Exactly Whole Word" position="top" placement="end">
                <ActionIcon
                    onClick={onMatchExaclyWord}
                    variant={matchExaclyWord ? 'light' : 'transparent'}
                    color={matchExaclyWord ? 'blue' : 'gray'}><AB size={16} /></ActionIcon>
            </Tooltip>
            <Tooltip label="Use a regular expression. Press enter after finish of typing to perform a search" position="top" placement="end">
                <ActionIcon
                    onClick={onRegularExpression}
                    variant={regularExpression ? 'light' : 'transparent'}
                    color={regularExpression ? 'blue' : 'gray'}><Asterisk size={16} /></ActionIcon>
            </Tooltip>
            <Tooltip label="Clear" position="top" placement="end">
                <ActionIcon onClick={onClear} variant="transparent"><Eraser size={16} /></ActionIcon>
            </Tooltip>
        </div>

    );

    return (
        <div style={{
            width: '100%',
            position: 'relative',
            display: 'flex'
        }}>
            <Tooltip disabled={!error} style={{ flex: 1 }} label={error ? error.message || error : ''}>
                <Input onKeyDown={onEnterKeyDown} value={value}
                    onChange={(event: any) => setValue(event.currentTarget.value)}
                    icon={<Search />}
                    variant={'filled'}
                    size="md"
                    style={{ width: '100%', border: error ? '2px solid #d32f2f' : '' }}
                    placeholder="Search for normal text or put an regex"
                />
            </Tooltip>

            {actionSection}
        </div>)
}

export default SearchInput;