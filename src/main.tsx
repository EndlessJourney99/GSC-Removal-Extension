import { render } from 'preact';
import { App } from './app';
import './index.css';
import { AppState } from './signals/globalContext';
import { chromeSignal } from './signals/globalSignal';
import { initDB } from './hooks/IndexedDB';
import { DBConfig } from './utils/IndexedDBConfig';

initDB(DBConfig);
render(
    <AppState.Provider value={chromeSignal()}>
        <App />
    </AppState.Provider>,
    document.getElementById('app') as HTMLElement
);
