import { createReadonlyTransaction } from './hooks/IndexedDB/createReadonlyTransaction';
import { BackgroundMessage } from './types/Execution';
import { RemovalUrlDb } from './types/RemovalUrl';
import { dbName } from './utils/GlobalUtils';
import { DBConfig } from './utils/IndexedDBConfig';

async function openDB(callback: (dbInstance: IDBDatabase) => void) {
    let db: IDBDatabase;
    const openRequest = self.indexedDB.open(DBConfig.name, DBConfig.version);

    openRequest.onerror = function (event: Event) {
        console.log("Everyhour isn't allowed to use IndexedDB?!" + this);
    };

    // upgrade needed is called when there is a new version of you db schema that has been defined
    openRequest.onupgradeneeded = function (event: IDBVersionChangeEvent) {
        db = this.result;

        if (!db.objectStoreNames.contains(dbName)) {
            // if there's no store of 'storeName' create a new object store
            db.createObjectStore(dbName, { keyPath: 'key' }); //some use keyPath: "id" (basically the primary key) - unsure why yet
        }
    };

    openRequest.onsuccess = function (event) {
        db = this.result;
        if (callback) {
            callback(db);
        }
    };
}

const updateDataBase = (data: RemovalUrlDb) => {
    openDB((db) => {
        const transaction = db.transaction(dbName, 'readwrite');
        const store = transaction.objectStore(dbName);

        transaction.oncomplete = (event) => console.log(event);

        store.put(data);
    });
};

const handShakeWithExtension = async () => {
    try {
        const handShake = await chrome.runtime.sendMessage<
            BackgroundMessage,
            string
        >({ Command: 'HandShake' });
        return handShake.length;
    } catch {
        return false;
    }
};

const forwardMessageToExtension = (message: BackgroundMessage) => {
    chrome.runtime.sendMessage<BackgroundMessage>(message);
};

chrome.runtime.onMessage.addListener(async function (
    message: BackgroundMessage,
    sender,
    sendResponse
) {
    const isExtensionAlive = await handShakeWithExtension();
    if (message.UpdateData?.Status === 'Exceed_Quota' && isExtensionAlive) {
        message.Command = 'Display_Error';
        forwardMessageToExtension(message);
    } else {
        if (isExtensionAlive) {
            message.Command = 'UpdateData';
            forwardMessageToExtension(message);
        } else if (message.UpdateData !== undefined) {
            updateDataBase({ ...message.UpdateData });
        }
    }
});
