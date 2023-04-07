import { createContext } from 'preact';
import { GlobalSignal } from './globalSignal';
import { signal } from '@preact/signals';

export const AppState = createContext<GlobalSignal>({
    manifest: signal(chrome.runtime.getManifest()),
    tabInfo: signal({} as chrome.tabs.Tab),
});
