import { useEffect, useState } from 'preact/hooks';

const useChrome = () => {
    const [tabInfo, setTabInfo] = useState<chrome.tabs.Tab>();
    const [manifest, setManifest] = useState<any>();

    useEffect(() => {
        chrome.tabs.query({ active: true }, (tabs) => {
            if (tabs && tabs.length) setTabInfo(tabs[0]);
        });
        setManifest(chrome.runtime.getManifest());
    }, []);

    return { tabInfo, manifest };
};

export default useChrome;
