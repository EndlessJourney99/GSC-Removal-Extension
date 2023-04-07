import { Signal, signal } from '@preact/signals';

export interface GlobalSignal {
    manifest: Signal<any>;
    tabInfo: Signal<chrome.tabs.Tab>;
}

const chromeSignal = (): GlobalSignal => {
    const manifest = signal<any>(chrome.runtime.getManifest());
    const tabInfo = signal<chrome.tabs.Tab>({} as chrome.tabs.Tab);
    return { manifest: manifest, tabInfo: tabInfo };
};

export { chromeSignal };
