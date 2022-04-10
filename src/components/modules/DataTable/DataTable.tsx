import React, { memo, useCallback, useMemo, useTransition } from 'react';
import { ScrollArea, Table, Text, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowNarrowDown, ArrowNarrowUp } from 'tabler-icons-react';
import { State } from '../../../store/reducers';
import './DataTable.scss'
import { setOrder } from '../../../store/actions/search.actions';
import usePersistData from '../../../hooks/usePersistData';

const DataTable = memo(() => {
    const elements = useSelector((state: State) => state.search.result);
    const textSize = useSelector((state: State) => state.search.textSize);
    const order = usePersistData(useSelector((state: State) => state.search.order), { key: 'order' });
    const [_, startTransition] = useTransition();
    const dispatch = useDispatch();

    function onSetOrder(type: string) {
        // console.log("type: ", type)
        startTransition(() => {
            if (order.includes(type)) {
                const newOrder = order == `-${type}` ? `+${type}` : `-${type}`;
                // console.log("newOrder", newOrder)
                dispatch(setOrder(`${newOrder}` as any))
            } else {
                dispatch(setOrder(`-${type}` as any))
            }
        })
    }

    const ths = (
        <tr>
            <th onClick={() => onSetOrder('name')} className='th' style={{ width: '25%' }}>
                Name
                <i style={{ opacity: order.includes('name') ? 1 : 0 }}>
                    {order == '-name' && <ArrowNarrowUp></ArrowNarrowUp>}
                    {order == '+name' && <ArrowNarrowDown></ArrowNarrowDown>}
                </i>
            </th>
            <th onClick={() => onSetOrder('size')} className='th' style={{ width: '10%' }}>
                Size
                <i style={{ opacity: order.includes('size') ? 1 : 0 }}>
                    {order == '-size' && <ArrowNarrowUp></ArrowNarrowUp>}
                    {order == '+size' && <ArrowNarrowDown></ArrowNarrowDown>}
                </i>
            </th>
            <th onClick={() => onSetOrder('mimetype')} className='th' style={{ width: '10%' }}>
                Type
                <i style={{ opacity: order.includes('mimetype') ? 1 : 0 }}>
                    {order == '-mimetype' && <ArrowNarrowUp></ArrowNarrowUp>}
                    {order == '+mimetype' && <ArrowNarrowDown></ArrowNarrowDown>}
                </i>
            </th>
            <th onClick={() => onSetOrder('lastDateModified')} className='th' style={{ width: '15%' }}>
                Date Modified
                <i style={{ opacity: order.includes('lastDateModified') ? 1 : 0 }}>
                    {order == '-lastDateModified' && <ArrowNarrowUp></ArrowNarrowUp>}
                    {order == '+lastDateModified' && <ArrowNarrowDown></ArrowNarrowDown>}
                </i>
            </th>
            <th className='th' style={{ width: '40%' }}>
                Location
                {/* <i>
                    <ArrowNarrowUp></ArrowNarrowUp>
                </i> */}
            </th>


        </tr>
    );

    const rows = elements.map((element, index) => (
        <tr key={element.path + element.name + index}>
            <td>
                <Tooltip label={element.name}>
                    <Text size={textSize} lineClamp={2}>
                        {element.name}
                    </Text>
                </Tooltip>
            </td>
            <td>

                <Text size={textSize} lineClamp={1}>
                    {element.sizeLabel}
                </Text>

            </td>
            <td>
                <Tooltip label={element.mimetype}>
                    <Text size={textSize} lineClamp={1}>
                        {element.mimetype}
                    </Text>
                </Tooltip>
            </td>
            <td>

                <Text size={textSize} lineClamp={1}>
                    {element.lastDateModified as Date}
                </Text>

            </td>
            <td>
                <Tooltip label={element.path}>
                    <Text size={textSize} lineClamp={1}>
                        {element.path}
                    </Text>
                </Tooltip>
            </td>

        </tr>
    ));

    return (
        <div className='DataTable'>
            <ScrollArea style={{ height: 'calc(100vh - (68px + 70px))', width: '100%' }}>
                <Table highlightOnHover verticalSpacing="xs" captionSide="bottom">
                    <thead>{ths}</thead>

                    <tbody>
                        {rows}
                    </tbody>

                </Table>
            </ScrollArea>
        </div >
    )
});

export default DataTable;