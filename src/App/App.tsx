import React, { useEffect, useRef, useTransition } from 'react';
import './App.scss';
import Layout from '../components/layout/layout/Layout';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import DataTable from '../components/modules/DataTable/DataTable';
import Footer from '../components/layout/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { IFile, IRequestSearch } from '../models/file.model';
import { setIsSearching, setNewResult, setResults } from '../store/actions/search.actions';
import LoadingSearch from '../components/modules/LoadingSearch/LoadingSearch';
import usePersistData from '../hooks/usePersistData';
import { State } from '../store/models/index.state';
const { ipcRenderer } = window.require('electron');


let isBussy = false;

function App() {
  const version = "1.1.1";
  
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
  const cache = useRef<any>({});
  const timeoutSearch = useRef<any>({});
  const stopSearh = useRef<boolean>(false);




  useEffect(() => {
    if (mount.current < 1) {
      mount.current++;
      return;
    }
    // console.log("Ejecute esto")
    search(directory, searchFile, options);
  }, [directory, searchFile, options])

  useEffect(() => {
    ipcRenderer.on('found-result', onFoundResult);
    ipcRenderer.on('finish', onFinish);
    ipcRenderer.on('refresh', onRefresh);

    return () => {
      ipcRenderer.removeListener('found-result', onFoundResult);
      ipcRenderer.removeListener('finish', onFinish);
      ipcRenderer.removeListener('refresh', onRefresh);
    }
  }, [])

  function onFoundResult(_: any, data: { data: IFile }) {
    // console.log("🚀 ~ file: App.tsx ~ line 72 ~ onFoundResult ~ data", data)
    if (stopSearh.current) return;
    if (cache.current[data.data.id]) return;
    cache.current[data.data.id] = true;
    newFilesComming.current.push(data.data);
    if (isCollecting.current) return;
    isCollecting.current = true;
    dispatch(setIsSearching(true));
    clearTimeout(timeoutSearch.current);

    timeoutSearch.current = setTimeout(() => {
      startTransition(() => {
        dispatch(setNewResult([...newFilesComming.current] as any));
      })
      newFilesComming.current = [];
      cache.current = {};
      isCollecting.current = false;
    }, 150)
  }

  function onFinish() {
    dispatch(setIsSearching(false));
  }



  async function onRefresh() {
    if (isBussy) return;
    isBussy = true;
    search(directory, searchFile, options);
    await _delayMs(150);
    isBussy = false;
  }

  async function search(dir: any, searchPar: any, opt: any) {
    stopCurrentSearch();
    await dispatch(setResults([]));
    await _delayMs(100);
    const requestToSearch: IRequestSearch = {
      directories: dir,
      searchParam: searchPar,
      options: opt
    }
    ipcRenderer.send('search', requestToSearch);
    stopSearh.current = false;
    dispatch(setIsSearching(true));
  }

  function stopCurrentSearch() {
    ipcRenderer.send('stop-current-search');
    stopSearh.current = true;
    clearTimeout(timeoutSearch.current);
    newFilesComming.current = [];
    cache.current = {};
    isCollecting.current = false;
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
        <LoadingSearch key={isSearching as any} opened={isSearching} setOpened={stopCurrentSearch} />
      </MantineProvider>
    </ColorSchemeProvider >
  );
}

export default App;
