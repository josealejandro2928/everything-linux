import React, { memo, useEffect, useTransition } from 'react';
import { ScrollArea, Table, Text } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowNarrowDown, ArrowNarrowUp } from 'tabler-icons-react';
import { State } from '../../../store/reducers';
import './DataTable.scss'
import { setOrder } from '../../../store/actions/search.actions';

const DataTable = memo(() => {
    const elements = useSelector((state: State) => state.search.result);
    const textSize = useSelector((state: State) => state.search.textSize);
    const order = useSelector((state: State) => state.search.order);
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
            <th onClick={() => onSetOrder('name')} className='th' style={{ width: '30%' }}>
                Name
                <i style={{ opacity: order.includes('name') ? 1 : 0 }}>
                    {order == '-name' && <ArrowNarrowUp></ArrowNarrowUp>}
                    {order == '+name' && <ArrowNarrowDown></ArrowNarrowDown>}
                </i>
            </th>
            <th onClick={() => onSetOrder('size')} className='th'  style={{ width: '10%' }}>
                Size
                <i style={{ opacity: order.includes('size') ? 1 : 0 }}>
                    {order == '-size' && <ArrowNarrowUp></ArrowNarrowUp>}
                    {order == '+size' && <ArrowNarrowDown></ArrowNarrowDown>}
                </i>
            </th>
            <th onClick={() => onSetOrder('mimetype')} className='th' style={{ width: '15%' }}>
                Type
                <i style={{ opacity: order.includes('mimetype') ? 1 : 0 }}>
                    {order == '-mimetype' && <ArrowNarrowUp></ArrowNarrowUp>}
                    {order == '+mimetype' && <ArrowNarrowDown></ArrowNarrowDown>}
                </i>
            </th>
            <th className='th' style={{ width: '45%' }}>
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
                <Text size={textSize} lineClamp={2}>
                    {element.name}
                </Text>
            </td>
            <td>
                <Text size={textSize} lineClamp={1}>
                    {element.size}
                </Text>
            </td>
            <td>
                <Text size={textSize} lineClamp={1}>
                    {element.mimetype}
                </Text>
            </td>
            <td>
                <Text size={textSize} lineClamp={1}>
                    {element.path}
                </Text>
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