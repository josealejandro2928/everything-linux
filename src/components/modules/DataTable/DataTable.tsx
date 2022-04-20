import React, { memo, useEffect, useRef, useTransition } from 'react';
import { ScrollArea, Table, Text, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowNarrowDown, ArrowNarrowUp } from 'tabler-icons-react';
import { State } from '../../../store/reducers';
import './DataTable.scss'
import { setOrder } from '../../../store/actions/search.actions';
import usePersistData from '../../../hooks/usePersistData';
import { useInView } from "react-intersection-observer";
import { IFile } from '../../../models/file.model';
const { ipcRenderer } = window.require('electron');


const DataTable = memo(() => {
    const elements = useSelector((state: State) => state.search.result);
    const textSize = useSelector((state: State) => state.search.textSize);
    const searchFile = useSelector((state: State) => state.search.searchFile);
    const order = usePersistData(useSelector((state: State) => state.search.order), { key: 'order' });
    const totalItems = useSelector((state: State) => state.search.result.length);
    const [_, startTransition] = useTransition();
    const dispatch = useDispatch();

    function onSetOrder(type: string) {
        startTransition(() => {
            if (order.includes(type)) {
                const newOrder = order == `-${type}` ? `+${type}` : `-${type}`;
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
            <th onClick={() => onSetOrder('mtime')} className='th' style={{ width: '15%' }}>
                Date Modified
                <i style={{ opacity: order.includes('mtime') ? 1 : 0 }}>
                    {order == '-mtime' && <ArrowNarrowUp></ArrowNarrowUp>}
                    {order == '+mtime' && <ArrowNarrowDown></ArrowNarrowDown>}
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
        <VirtualScrollChild height={28} total={totalItems}
            id={element.id + index}
            onContextMenu={(e: any) => {
                e.preventDefault();
                onOpenContextMenu(element)
            }}
            onDoubleClick={(e: any) => {
                onOpenFile(element);
            }}
        >
            <RowTable
                name={element.name}
                icon={element.icon}
                path={element.path}
                mimetype={element.mimetype}
                sizeLabel={element.sizeLabel}
                lastDateModified={element.lastDateModified}
                textSize={textSize}
                searchFile={searchFile}
            />
        </VirtualScrollChild>
    ));

    const onOpenContextMenu = (el: IFile) => {
        ipcRenderer.send('show-context-menu', el)
    }

    const onOpenFile = (el: IFile) => {
        ipcRenderer.send('open-file', el)
    }



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


const RowTable = memo(({ name, sizeLabel, mimetype, lastDateModified, path, icon, textSize, searchFile, }: any) => {
    const showHighLight = useSelector((state: State) => state.settings.showHighLight)
    return (
        <>
            <td >
                <Tooltip label={name}>
                    <Text size={textSize} lineClamp={2}>
                        <div style={{ 'display': 'flex', gap: '8px', justifyContent: 'flex-start', 'alignItems': 'center' }}>
                            <img height={30} src={icon} />
                            <HighLight show={showHighLight} searchText={searchFile}>
                                {name}
                            </HighLight>

                        </div>

                    </Text>
                </Tooltip>
            </td>
            <td >

                <Text size={textSize} lineClamp={1}>
                    {sizeLabel}
                </Text>

            </td>
            <td >
                <Tooltip label={mimetype}>
                    <Text size={textSize} lineClamp={1}>
                        {mimetype}
                    </Text>
                </Tooltip>
            </td>
            <td >

                <Text size={textSize} lineClamp={1}>
                    {lastDateModified as Date}
                </Text>

            </td>
            <td >
                <Tooltip label={path}>
                    <Text size={textSize} lineClamp={1}>
                        {path}
                    </Text>
                </Tooltip>
            </td>
        </>
    )
});

/**
 * A wrapper component for children of
 * VirtualScroll. Computes inline style and
 * handles whether to display props.children.
 */
const VirtualScrollChild = memo(({ height, children, total = 50, onDoubleClick = () => { }, onContextMenu = () => { }, id }:
    { height: any, children: any, total: number, onDoubleClick: Function, onContextMenu: Function, id: string }) => {
    const [ref, inView] = useInView();
    // console.log("🚀 ~ file: DataTable.tsx ~ line 152 ~ VirtualScrollChild ~ inView", inView)
    const style = {
        height: `${height}px`,
        overflow: 'hidden',
        cursor: 'pointer',
        // display: inView ? 'contents' : 'none'
    };
    return (
        <tr id={id}
            onDoubleClick={onDoubleClick as any}
            onContextMenu={onContextMenu as any}
            onClick={() => {
                const el = document.getElementById(id);
                el?.classList.toggle('active');
            }}
            style={style} ref={ref}>
            {(inView || total < 80) ? children : null}
        </tr>
    );
})

const HighLight = memo(({ children, show = false, searchText = '' }:
    { children: any, show: boolean, searchText: string }) => {
    let element = useRef<any>(null)

    useEffect(() => {
        if (show && searchText && element.current) {
            let text = element.current.innerHTML as string;
            let re = new RegExp(searchText, "gi");
            let newText = text.match(re)?.map((e) => {
                return text.replace(e, `<mark>${e}</mark>`)
            }).join('');
            if (newText)
                element.current.innerHTML = newText;
        }
    }, [show, searchText, element.current])
    return (
        <React.Fragment>
            {(!show || !searchText) &&
                <>{children}</>
            }
            {show && searchText &&
                <span ref={element}>{children}</span>
            }
        </React.Fragment>
    );
})

export default DataTable;