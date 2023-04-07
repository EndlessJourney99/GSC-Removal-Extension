import { useSignal } from '@preact/signals';
import { useIndexedDB } from '../../hooks/IndexedDB';
import { dbName } from '../../utils/GlobalUtils';
import { RemovalUrlDb } from '../../types/RemovalUrl';
import { useEffect } from 'preact/hooks';

const ImportedLinks = () => {
    const { add, getAll, deleteRecord } = useIndexedDB(dbName);
    const urlData = useSignal<Array<RemovalUrlDb>>([]);

    useEffect(() => {
        getAll<RemovalUrlDb>().then((data) => {
            urlData.value = data;
        });
    }, []);

    return <section key="List-Imported-Urls">
        <table>
            
        </table>
    </section>;
};

export default ImportedLinks;
