import React from 'react';
import { ScrollArea, Table, Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import { ArrowNarrowUp } from 'tabler-icons-react';
import { State } from '../../../store/reducers';
import './DataTable.scss'

const DataTable = () => {
    const elements = useSelector((state: State) => state.search.result);
    const textSize = useSelector((state: State) => state.search.textSize)
    // console.log("🚀 ~ file: DataTable.tsx ~ line 10 ~ DataTable ~ elements", elements)

    const ths = (
        <tr>
            <th className='th' style={{ width: '35%' }}>
                Name
                <i>
                    <ArrowNarrowUp></ArrowNarrowUp>
                </i>
            </th>
            <th className='th'>
                Size
                <i>
                    <ArrowNarrowUp></ArrowNarrowUp>
                </i>
            </th>
            <th className='th'>
                Type
                <i>
                    <ArrowNarrowUp></ArrowNarrowUp>
                </i>
            </th>
            <th className='th' style={{ width: '45%' }}>
                Location
                <i>
                    <ArrowNarrowUp></ArrowNarrowUp>
                </i>
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
}

export default DataTable;