import { useSignal } from '@preact/signals';
import { useIndexedDB } from '../../hooks/IndexedDB';
import { dbName } from '../../utils/GlobalUtils';
import { RemovalStatus, RemovalUrlDb } from '../../types/RemovalUrl';
import { useEffect } from 'preact/hooks';
import { Pagination } from '../Pagination';

const ImportedLinks = () => {
    const { add, getAll, deleteRecord } = useIndexedDB(dbName);
    const urlData = useSignal<Array<RemovalUrlDb>>([]);
    const tableRow = useSignal<Array<RemovalUrlDb>>([]);
    const pageIndex = useSignal(0);
    const PAGE_SIZE = 20;
    const updatePageIndex = (index: number) => {
        pageIndex.value = index;
        const skip = pageIndex.value * PAGE_SIZE;
        tableRow.value = urlData.value.slice(skip, skip + PAGE_SIZE);
    };

    const deleteUrl = (id: any) => {
        deleteRecord(id);
        const replica = urlData.peek();
        const elem = replica.find((d) => d.id === id);
        if (elem) {
            const dataIndex = replica.indexOf(elem);
            if (dataIndex > -1) {
                replica.splice(dataIndex, 1);
                urlData.value = replica;
                tableRow.value = replica.slice(
                    pageIndex.value * PAGE_SIZE,
                    PAGE_SIZE
                );
            }
        }
    };
    const statusBadge = (status: RemovalStatus) => {
        switch (status) {
            case 'Done':
                return (
                    <span className="text-white bg-green-400 rounded-md px-2 py-1">
                        Done
                    </span>
                );
            case 'Failed':
                return (
                    <span className="text-white bg-red-400 rounded-md px-2 py-1">
                        Failed
                    </span>
                );
            case 'Url_Not_In_Property':
                return (
                    <span className="text-white bg-gray-400 rounded-md px-2 py-1">
                        Invalid
                    </span>
                );
            case 'Queue':
                return (
                    <span className="text-white font-bold bg-yellow-600 rounded-md px-2 py-1">
                        Queue
                    </span>
                );
            default:
                break;
        }
    };

    useEffect(() => {
        getAll<RemovalUrlDb>().then((data) => {
            urlData.value = data;
            tableRow.value = urlData.value.slice(
                pageIndex.value * PAGE_SIZE,
                PAGE_SIZE
            );
        });
    }, []);

    return (
        <section key="List-Imported-Urls">
            <table class="table-fixed w-full text-left [&>tbody>tr>td]:pr-2">
                <thead>
                    <tr>
                        <th className="w-64">Url</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRow.value.map((item: RemovalUrlDb) => (
                        <tr key={item.id}>
                            <td className="whitespace-break-spaces break-words">
                                {item.URL}
                            </td>
                            <td>{statusBadge(item.Status)}</td>
                            <td>
                                <button
                                    className="p-2 bg-red-400 rounded-md text-white hover:bg-red-600"
                                    onClick={() => deleteUrl(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {urlData.value.length === 0 && (
                        <tr>
                            <td
                                colSpan={3}
                                className="text-gray-600 font-bold text-center p-4 border-t"
                            >
                                Database empty!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination
                displayPage={5}
                itemPerPage={PAGE_SIZE}
                totalItems={urlData.value.length}
                currentIndex={pageIndex}
                callBack={updatePageIndex}
                className="text-center pt-5"
            />
        </section>
    );
};

export default ImportedLinks;
