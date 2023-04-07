import UploadFileIcon from '@mui/icons-material/UploadFile';
import Download from '@mui/icons-material/Download';
import Delete from '@mui/icons-material/Delete';
import Cancel from '@mui/icons-material/CancelOutlined';
import Play from '@mui/icons-material/PlayArrow';
import BlockIcon from '@mui/icons-material/Block';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useRef } from 'preact/hooks';
import { TargetedEvent } from 'preact/compat';
import { readCsvFile } from '../../utils/GlobalUtils';
import { RemovalUrlCsv, RemovalUrlDb } from '../../types/RemovalUrl';
import { batch } from '@preact/signals';
import Notify from '../Notify';
import { computed } from '@preact/signals';
import { RemoveMethod, RemoveType, useRemoval } from '../../hooks/useRemoval';

const Removal = () => {
    const {
        isStart,
        removeType,
        delays,
        methods,
        HandleActionButton,
        urlData,
        isNotify,
        notifyMsg,
        notifyType,
        clearDb,
        addDB,
    } = useRemoval();
    const countQueue = computed(
        () => urlData.value.filter((d) => d.Status === 'Queue').length
    );
    const countInvalid = computed(
        () =>
            urlData.value.filter((d) => d.Status === 'Url_Not_In_Property')
                .length
    );
    const countFailed = computed(
        () => urlData.value.filter((d) => d.Status === 'Failed').length
    );
    const countDone = computed(
        () => urlData.value.filter((d) => d.Status === 'Done').length
    );

    const fileInput = useRef<HTMLInputElement>(null);
    const triggerFileInput = () =>
        fileInput.current && fileInput.current.click();

    const onUploadFile = async (
        event: TargetedEvent<HTMLInputElement, Event>
    ) => {
        if (event.currentTarget.files && event.currentTarget.files.length > 0) {
            try {
                clearDb();
                const csvFile = event.currentTarget.files[0];
                const result = await readCsvFile<RemovalUrlCsv>(csvFile);
                const dbSchema: Array<RemovalUrlDb> = result
                    .filter((i) => i.URL.length)
                    .map((item: RemovalUrlCsv) => {
                        const casting: RemovalUrlDb = {
                            ...item,
                            Status: 'Queue',
                        };
                        return casting;
                    });
                dbSchema.forEach((item) => {
                    if (item.URL.length)
                        addDB<RemovalUrlDb>(item).then(
                            (id) => {
                                console.log(`${item.URL} inserted : ID ${id}`);
                                item.id = id;
                            },
                            (error) => {
                                console.error(
                                    `Failed to inserted ${item.URL} : ${error}`
                                );
                            }
                        );
                });
                batch(() => {
                    notifyMsg.value = 'Url Loaded';
                    isNotify.value = true;
                    notifyType.value = 'Success';
                    urlData.value = dbSchema;
                });
            } catch (error) {
                batch(() => {
                    notifyMsg.value = 'Failed to load url';
                    isNotify.value = true;
                    notifyType.value = 'Error';
                });
                console.error(error);
            }
        }
    };

    const clearDB = () => {
        clearDb();
        batch(() => {
            notifyMsg.value = 'Database clear!';
            notifyType.value = 'Success';
            isNotify.value = true;
            urlData.value = [];
        });
    };

    return (
        <section key="Removal-Fnc">
            <div className="grid grid-cols-4 gap-1 py-3 border-b">
                <div className="col-span-3 text-start">
                    <button
                        className="pr-3 text-sm text-blue-500 underline hover:text-blue-700"
                        onClick={triggerFileInput}
                    >
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInput}
                            accept=".csv"
                            onChange={onUploadFile}
                        />
                        <UploadFileIcon />
                        Import CSV
                    </button>
                    <a
                        href="/Sample-Table.csv"
                        target="_blank"
                        className="text-sm underline text-start text-cyan-500 hover:text-cyan-700"
                    >
                        <Download />
                        Sample CSV
                    </a>
                </div>
                <button
                    className="col-span-1 text-sm text-red-500 text-start hover:text-red-600"
                    onClick={clearDB}
                >
                    <Delete />
                    Clear DB
                </button>
            </div>
            <Notify
                visible={isNotify}
                msg={notifyMsg.value}
                notifyType={notifyType.value}
                timeOut={2000}
            />
            <div className="grid grid-cols-4 gap-0 py-3">
                <div className="col-auto px-5 py-6 text-center border rounded-md">
                    <span className="font-bold text-yellow-600">
                        {countQueue}
                        <br />
                        Queue
                    </span>
                </div>
                <div className="col-auto px-5 py-6 text-center border rounded-md">
                    <span className="font-bold text-gray-600-600">
                        {countInvalid}
                        <br />
                        Invalid
                    </span>
                </div>
                <div className="col-auto px-5 py-6 text-center border rounded-md">
                    <span className="font-bold text-red-600">
                        {countFailed}
                        <br />
                        Failed
                    </span>
                </div>
                <div className="col-auto px-5 py-6 text-center border rounded-md">
                    <span className="font-bold text-green-500">
                        {countDone}
                        <br />
                        Done
                    </span>
                </div>
            </div>

            <h5 className="font-bold">Remove Option</h5>
            <div className="grid grid-cols-2 gap-4 py-3">
                <div className="col-auto group">
                    <input
                        type="radio"
                        id="Temporary"
                        name="RemoveType"
                        value={RemoveType.Temporary}
                        className="hidden"
                        checked={removeType.value === RemoveType.Temporary}
                        onChange={(e) => {
                            if (e.currentTarget.checked)
                                removeType.value = RemoveType.Temporary;
                        }}
                        required
                    />
                    <label
                        for="Temporary"
                        className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer group-[:has(input:checked)]:border-blue-600 group-[:has(input:checked)]:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <div className="block text-center">
                            <div className="w-full text-lg font-semibold  group-[:has(input:checked)]:text-red-600">
                                <BlockIcon />
                            </div>
                            <div className="w-full font-bold">
                                Temporary Remove
                            </div>
                        </div>
                    </label>
                </div>
                <div className="col-auto group">
                    <input
                        type="radio"
                        id="clear-cached"
                        name="RemoveType"
                        value={RemoveType.Clear_Cached}
                        checked={removeType.value === RemoveType.Clear_Cached}
                        onChange={(e) => {
                            if (e.currentTarget.checked)
                                removeType.value = RemoveType.Clear_Cached;
                        }}
                        className="hidden"
                    />
                    <label
                        for="clear-cached"
                        className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer group-[:has(input:checked)]:border-blue-600 group-[:has(input:checked)]:text-blue-600 hover:text-gray-600 hover:bg-gray-100 group"
                    >
                        <div className="block text-center">
                            <div className="w-full text-lg font-semibold group-[:has(input:checked)]:text-red-600">
                                <DeleteSweepIcon />
                            </div>
                            <div className="w-full font-bold">Clear Cached</div>
                        </div>
                    </label>
                </div>
            </div>

            <h5 className="font-bold">Delays (Seconds)</h5>
            <div className="w-100 py-3 relative">
                <input
                    type="number"
                    step={1}
                    min={1}
                    value={delays}
                    onChange={(e) =>
                        (delays.value = parseInt(e.currentTarget.value, 10))
                    }
                    className="w-full rounded-md px-2 py-3 border border-gray-600 focus-visible:outline-gray-400"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 p-1 px-2 border border-gray-400 bg-slate-200 rounded-md font-bold text-gray-600">
                    Seconds
                </span>
            </div>

            <h5 className="font-bold">Methods</h5>
            <div className="py-3">
                <div class="flex items-center mb-4">
                    <input
                        id="this-url-only"
                        type="radio"
                        value={RemoveMethod.THIS_URL_ONLY}
                        name="RemoveMethod"
                        checked={methods.value === RemoveMethod.THIS_URL_ONLY}
                        onChange={(e) => {
                            if (e.currentTarget.checked)
                                methods.value = RemoveMethod.THIS_URL_ONLY;
                        }}
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus-visible:outline-none focus:ring-blue-500"
                    />
                    <label
                        for="this-url-only"
                        class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                    >
                        Remove this URL only
                    </label>
                </div>
                <div class="flex items-center">
                    <input
                        id="urls-prefix"
                        type="radio"
                        value={RemoveMethod.URLS_PREFIX}
                        name="RemoveMethod"
                        checked={methods.value === RemoveMethod.URLS_PREFIX}
                        onChange={(e) => {
                            if (e.currentTarget.checked)
                                methods.value = RemoveMethod.URLS_PREFIX;
                        }}
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus-visible:outline-none focus:ring-blue-50"
                    />
                    <label
                        for="urls-prefix"
                        class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                    >
                        Remove all URLs with this prefix
                    </label>
                </div>
            </div>

            <h5 className="font-bold">Start/Stop</h5>
            <div className="py-3">
                <button
                    className={`w-full py-3 text-white bg-slate-600 font-bold rounded-md uppercase hover:bg-slate-600 active:bg-slate-800 ${
                        isStart.value ? ' animate-pulse' : ''
                    }`}
                    onClick={HandleActionButton}
                >
                    {isStart.value ? (
                        <span className="flex gap-1 justify-center">
                            Stop <Cancel />
                        </span>
                    ) : (
                        <span className="flex gap-1 justify-center">
                            Start <Play />
                        </span>
                    )}
                </button>
            </div>
        </section>
    );
};

export default Removal;
