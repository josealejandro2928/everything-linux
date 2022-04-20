import React, { useEffect, useRef, useState, useTransition } from 'react';
import './App.scss';
import Layout from '../components/layout/layout/Layout';
import { ColorScheme, ColorSchemeProvider, Notification, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import DataTable from '../components/modules/DataTable/DataTable';
import Footer from '../components/layout/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../store/reducers';
import { IFile, IRequestSearch } from '../models/file.model';
import { setIsSearching, setNewResult, setResults } from '../store/actions/search.actions';
import LoadingSearch from '../components/modules/LoadingSearch/LoadingSearch';
import usePersistData from '../hooks/usePersistData';
const { ipcRenderer } = window.require('electron');


let cache: any = {};
let isBussy = false;

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const directory = usePersistData(useSelector((state: State) => state.search.directory), { key: 'directory' });
  const searchFile = useSelector((state: State) => state.search.searchFile);
  const options = useSelector((state: State) => state.search.options);
  const isSearching = useSelector((state: State) => state.search.isSearching);
  const mount = useRef<number>(0);
  const dispatch = useDispatch();
  const [_, startTransition] = useTransition();
  const newFilesComming = useRef<Array<IFile>>([]);
  const isCollecting = useRef<boolean>(false);
  const [toast, setToasState] = useState({ title: '', body: '', show: false, color: 'green' });




  useEffect(() => {
    if (mount.current < 2) {
      mount.current++;
      return;
    }
    console.log("Ejecute esto")
    onSearch(directory, searchFile, options);
  }, [directory, searchFile, options])

  useEffect(() => {
    ipcRenderer.on('found-result', (_: any, data: { data: IFile }) => {
      if (cache[data.data.id]) return;
      cache[data.data.id] = true;
      newFilesComming.current.push(data.data);
      if (isCollecting.current) return;
      isCollecting.current = true;
      setTimeout(() => {
        startTransition(() => {
          dispatch(setNewResult([...newFilesComming.current] as any));
        })
        newFilesComming.current = [];
        cache = {};
        isCollecting.current = false;
      }, 250)
    });
  }, [])

  useEffect(() => {
    ipcRenderer.on('finish', () => {
      dispatch(setIsSearching(false));
    });

    ipcRenderer.on('clipboard', (_: any, param: string) => {
      setToasState({ ...toast, show: true, title: `Ok`, body: `${param} copied to clipboard` })
    })

    ipcRenderer.on('refresh', async (_: any, param: string) => {
      if (isBussy) return;
      console.log("Entre aqui en el refresh")
      isBussy = true;
      onSearch(directory, searchFile, options);
      await _delayMs(150);
      isBussy = false;
    })

    ipcRenderer.on('error', async (_: any, param: string) => {
      setToasState({ ...toast, show: true, title: `Error`, body: `${param}`, color: 'red' })
    })
  }, [])

  async function onSearch(dir: any, searchPar: any, opt: any) {
    ipcRenderer.send('stop-current-search');
    dispatch(setIsSearching(true));
    dispatch(setResults([]));
    newFilesComming.current = [];

    await _delayMs(150);
    const requestToSearch: IRequestSearch = {
      directories: dir,
      searchParam: searchPar,
      options: opt
    }
    ipcRenderer.send('search', requestToSearch);
  }

  function onStopCurrentSearch() {
    ipcRenderer.send('stop-current-search');
    dispatch(setIsSearching(false));
  }

  function _delayMs(ms: number): any {
    return new Promise((resolve, _) => {
      setTimeout(() => (resolve(true)), ms || 200);
    })
  }




  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>

      <MantineProvider theme={{
        colorScheme: colorScheme,
        fontFamily: `'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif`,
        colors: {
          dark: ["#FFF",
            "#A6A7AB",
            "#909296",
            "#5C5F66",
            "#373A40",
            "#2C2E33",
            "#25262B",
            "#1A1B1E",
            "#141517",
            "#101113"]
        }
      }} withGlobalStyles>
        <div className="App">
          <Layout>
            <DataTable></DataTable>
            <Footer></Footer>
          </Layout>
        </div>
        <LoadingSearch opened={isSearching} setOpened={onStopCurrentSearch} />
        <ToastNotification
          show={toast.show}
          title={toast.title}
          body={toast.body}
          color={toast.color}
          onClose={() => { setToasState({ ...toast, show: false }) }}
        />

      </MantineProvider>
    </ColorSchemeProvider >
  );
}

export default App;



const ToastNotification = ({ show, title, body, onClose, color }:
  { show: boolean, title: string, body?: any, onClose: Function, color: string }) => {
  const [showToast, setShowToast] = useState(false);
  const time = useRef<any>(null);

  useEffect(() => {
    setShowToast(show);
    clearTimeout(time.current);
    if (show) {
      time.current = setTimeout(() => {
        closeToast();
      }, 5000);
    }
  }, [show])

  function closeToast() {
    setShowToast(false);
    onClose();
  }

  return (
    <>
      {showToast && <Notification onClose={closeToast} color={color} className='ToastNotification' title={title}>
        {body}
      </Notification>}
    </>
  )
}
