import { useSignal } from '@preact/signals';
import { useContext, useEffect } from 'preact/compat';
import PermissionDenied from './components/PermissionDenied';
import { AppState } from './signals/globalContext';
import { compareHost } from './utils/GlobalUtils';
import Header from './components/Header';
import Functions from './components/Functions';
import Footer from './components/Footer';
import { GlobalSignal } from './signals/globalSignal';

export const App = () => {
    const state: GlobalSignal = useContext(AppState);
    const tabInfo = useSignal<chrome.tabs.Tab>({} as chrome.tabs.Tab);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length) {
                tabInfo.value = tabs[0];
                state.tabInfo.value = tabs[0];
            }
        });
    }, []);

    return (
        <div className="container mx-auto">
            <Header />
            {state.manifest.value &&
            tabInfo.value &&
            compareHost(
                state.manifest.value.host_permissions,
                tabInfo.value.url ?? ''
            ) ? (
                <Functions />
            ) : (
                <PermissionDenied manifest={state.manifest} />
            )}
            <Footer />
        </div>
    );
};
