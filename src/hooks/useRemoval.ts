import { useSignal } from '@preact/signals';
import { RemovalUrlDb } from '../types/RemovalUrl';
import { ServiceMessage } from '../types/Execution';

export enum RemoveType {
    Temporary,
    Clear_Cached,
}

export enum RemoveMethod {
    THIS_URL_ONLY,
    URLS_PREFIX,
}

export interface RemovalOptions {
    RemoveType: RemoveType;
    Delays: number;
    Methods: RemoveMethod;
}

type props = {
    data: Array<RemovalUrlDb>;
};

const StartRemoval = (data: Array<RemovalUrlDb>, options: RemovalOptions) => {
    if (data.length === 0) {
        throw new Error('Database empty!');
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTabId = tabs[0].id;
        if (currentTabId === undefined)
            throw new Error('Failed to get current open tabId');
        if (data === undefined) throw new Error('Removal data urls are empty!');
        if (options === undefined)
            throw new Error('Removal options are empty!');

        chrome.tabs.sendMessage<ServiceMessage>(currentTabId, {
            Command: 'Request',
            TabId: currentTabId,
            OptionParameters: options,
            Data: data,
            FunctionName: 'startRemove',
        });
    });
};

const useRemoval = ({ data }: props) => {
    const removeType = useSignal<RemoveType>(RemoveType.Temporary);
    const delays = useSignal<number>(1);
    const methods = useSignal<RemoveMethod>(RemoveMethod.THIS_URL_ONLY);
    const StartFunc = () =>
        StartRemoval(
            data.filter((d) => d.Status === 'Queue'),
            {
                RemoveType: removeType.value,
                Delays: delays.value,
                Methods: methods.value,
            }
        );

    return { removeType, delays, methods, StartFunc };
};

export { useRemoval };
