import { Container, Grid, Select, Table } from '@mantine/core';
import React from 'react';
import { ArrowNarrowUp } from 'tabler-icons-react';
import './DataTable.scss'

const DataTable = () => {
    const elements = [
        { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
        { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
        { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
        { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
        { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    ];

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

    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td>{element.position}</td>
            <td>{element.name}</td>
            <td>{element.symbol}</td>
            <td>{element.mass}</td>
        </tr>
    ));

    return (
        <div className='DataTable'>
            <Table striped highlightOnHover verticalSpacing={'sm'} captionSide="bottom">
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
                <caption>Some elements from periodic table</caption>
            </Table>
        </div>
    )
}

export default DataTable;