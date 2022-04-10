import React, { useEffect, useRef, useTransition } from 'react';
import './App.scss';
import Layout from '../components/layout/layout/Layout';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import DataTable from '../components/modules/DataTable/DataTable';
import Footer from '../components/layout/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../store/reducers';
import { IFile, IRequestSearch } from '../models/file.model';
import { setIsSearching, setNewResult, setResults } from '../store/actions/search.actions';
import LoadingSearch from '../components/modules/LoadingSearch/LoadingSearch';
const { ipcRenderer } = window.require('electron');


function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const directory = useSelector((state: State) => state.search.directory);
  const searchFile = useSelector((state: State) => state.search.searchFile);
  const options = useSelector((state: State) => state.search.options);
  const isSearching = useSelector((state: State) => state.search.isSearching);
  const mount = useRef<number>(0);
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (mount.current < 2) {
      mount.current++;
      return;
    }
    console.log("Ejecute esto")
    onSearch();
  }, [directory, searchFile, options])

  useEffect(() => {
    ipcRenderer.on('found-result', (_: any, data: { data: IFile }) => {
      startTransition(() => {
        dispatch(setNewResult(data.data));
      })
    });
  }, [])

  useEffect(() => {
    ipcRenderer.on('finish', () => {
      dispatch(setIsSearching(false));
    });
  }, [])

  async function onSearch() {
    ipcRenderer.send('stop-current-search');
    dispatch(setIsSearching(true));
    dispatch(setResults([]));
    await _delayMs(300);
    const requestToSearch: IRequestSearch = {
      directories: directory,
      searchParam: searchFile as string,
      options: options
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
      <MantineProvider theme={{ colorScheme: colorScheme }} withGlobalStyles>
        <div className="App">
          <Layout>
            <DataTable></DataTable>
            <Footer></Footer>
          </Layout>
        </div>
        <LoadingSearch opened={isSearching} setOpened={onStopCurrentSearch} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
