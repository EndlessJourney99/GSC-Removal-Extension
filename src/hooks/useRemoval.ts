import { batch, useSignal } from '@preact/signals';
import { RemovalUrlDb } from '../types/RemovalUrl';
import { BackgroundMessage, ServiceMessage } from '../types/Execution';
import { useContext, useEffect } from 'preact/hooks';
import { AppState } from '../signals/globalContext';
import { GlobalSignal } from '../signals/globalSignal';
import { useIndexedDB } from './IndexedDB';
import { dbName } from '../utils/GlobalUtils';
import { NotifyType } from '../components/Notify';

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

const CheckClientStatus = async (tabId: number): Promise<boolean> => {
    if (tabId < 0) return false;
    return await chrome.tabs.sendMessage<ServiceMessage, boolean>(tabId, {
        Command: 'CheckStatus',
    });
};

const StartRemoval = (
    tabId: number,
    data: Array<RemovalUrlDb>,
    options: RemovalOptions
) => {
    if (data.length === 0) {
        throw new Error('Database empty!');
    }

    if (tabId < 0) throw new Error('Failed to get current open tabId');
    if (data === undefined) throw new Error('Removal data urls are empty!');
    if (options === undefined) throw new Error('Removal options are empty!');

    chrome.tabs.sendMessage<ServiceMessage>(tabId, {
        Command: 'Start',
        OptionParameters: options,
        Data: data,
    });
};

const StopAction = async (tabId: number) => {
    if (tabId < 0) throw new Error('Failed to get current open tabId');

    await chrome.tabs.sendMessage<ServiceMessage>(tabId, {
        Command: 'Stop',
    });

    return;
};

const useRemoval = () => {
    const state: GlobalSignal = useContext(AppState);
    const { add, getAll, clear, update } = useIndexedDB(dbName);
    const isStart = useSignal<boolean>(false);
    const urlData = useSignal<Array<RemovalUrlDb>>([]);

    const removeType = useSignal<RemoveType>(RemoveType.Temporary);
    const delays = useSignal<number>(1);
    const methods = useSignal<RemoveMethod>(RemoveMethod.THIS_URL_ONLY);

    const isNotify = useSignal<boolean>(false);
    const notifyMsg = useSignal<string>('');
    const notifyType = useSignal<NotifyType>('Success');

    const StartFunc = () =>
        StartRemoval(
            state.tabInfo.value.id ?? -1,
            urlData.value.filter(
                (d) =>
                    d.Status === 'Queue' ||
                    d.Status === 'Failed' ||
                    d.Status === 'Exceed_Quota'
            ),
            {
                RemoveType: removeType.value,
                Delays: delays.value,
                Methods: methods.value,
            }
        );

    const CheckClientStatusFunc = () =>
        CheckClientStatus(state.tabInfo.value.id ?? -1);
    const HandleActionButton = async () => {
        try {
            if (!isStart.value) StartFunc();
            else await StopAction(state.tabInfo.value.id ?? -1);

            isStart.value = !isStart.value;
        } catch (e) {
            batch(() => {
                notifyMsg.value = (e as Error).message;
                isNotify.value = true;
                notifyType.value = 'Error';
            });
            isStart.value = false;
        }
    };

    useEffect(() => {
        CheckClientStatusFunc().then((status) => {
            isStart.value = status;
        });
        getAll<RemovalUrlDb>().then((data) => {
            urlData.value = data;
        });
        const messageListener = (
            message: BackgroundMessage,
            sender: any,
            response: any
        ) => {
            if (message.Command === 'HandShake') {
                response("I'm Alive");
            } else if (message.Command === 'Completed') {
                isStart.value = false;
                batch(() => {
                    notifyMsg.value = 'Completed!';
                    isNotify.value = true;
                    notifyType.value = 'Success';
                });
            } else if (
                message.Command === 'UpdateData' &&
                message.UpdateData !== undefined
            ) {
                update({ ...message.UpdateData });
                const row = urlData
                    .peek()
                    .find((v) => v.id === message.UpdateData?.id);
                if (row) {
                    row.Status = message.UpdateData.Status;
                    urlData.value = [
                        ...urlData.peek().filter((v) => v.id !== row.id),
                        row,
                    ];
                }
            } else if (
                message.Command === 'Display_Error' &&
                message.UpdateData !== undefined
            ) {
                isStart.value = false;
                batch(() => {
                    notifyMsg.value =
                        message.UpdateData?.Status === 'Exceed_Quota'
                            ? 'Đã vượt quá hạn mức 1000 URL / ngày !'
                            : 'Đã có lỗi xảy ra!';
                    isNotify.value = true;
                    notifyType.value = 'Error';
                });
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    return {
        isStart,
        removeType,
        delays,
        methods,
        HandleActionButton,
        urlData,
        isNotify,
        notifyMsg,
        notifyType,
        clearDb: clear,
        addDB: add,
    };
};

export { useRemoval };
