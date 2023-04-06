import { signal } from '@preact/signals';

const chromeSignal = () => {
    const manifest = signal<any>(chrome.runtime.getManifest());

    return { manifest };
};

export { chromeSignal };
