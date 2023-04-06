import { IndexedDBProps } from '../hooks/IndexedDB';
import { dbName } from './GlobalUtils';

export const DBConfig: IndexedDBProps = {
    name: 'GSCExtensionDB',
    version: 1,
    objectStoresMeta: [
        {
            store: dbName,
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'URL', keypath: 'URL', options: { unique: false } },
                {
                    name: 'LastCrawled',
                    keypath: 'LastCrawled',
                    options: { unique: false },
                },
                {
                    name: 'Status',
                    keypath: 'Status',
                    options: { unique: false },
                },
            ],
        },
    ],
};
