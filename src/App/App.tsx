import React, { useEffect } from 'react';
import './App.scss';
import Layout from '../components/layout/Layout';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import DataTable from '../components/modules/DataTable/DataTable';
import Footer from '../components/modules/Footer/Footer';
import { useSelector } from 'react-redux';
import { State } from '../store/reducers';

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

  useEffect(() => {
    console.log("directory", directory);
    console.log("searchFile", searchFile);
  }, [directory, searchFile])




  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme: colorScheme }} withGlobalStyles>
        <div className="App">
          <Layout>
            <DataTable></DataTable>
            <Footer></Footer>
          </Layout>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
