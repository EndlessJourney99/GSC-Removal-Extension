import { Signal, computed, useSignal } from '@preact/signals';

interface props extends React.HTMLAttributes<HTMLElement> {
    displayPage: number;
    totalItems: number;
    itemPerPage: number;
    currentIndex: Signal<number>;
    callBack?: (index: number) => void;
}

const Pagination = ({
    totalItems,
    displayPage,
    itemPerPage,
    currentIndex,
    callBack,
    ...rest
}: props) => {
    const totalPage = computed(() => Math.ceil(totalItems / itemPerPage));
    let startPage = computed(() =>
        Math.max(currentIndex.value - Math.floor(displayPage / 2), 0)
    );
    const endPage = computed(() =>
        Math.min(startPage.value + displayPage - 1, totalPage.value)
    );
    const realDisplayPage = computed(() =>
        Math.min(totalPage.value, displayPage)
    );

    const generateItems = () => {
        const items: JSX.Element[] = [];
        for (let i = startPage.value; i < endPage.value; i++) {
            items.push(
                <li
                    className={
                        currentIndex.value === i ? 'active group' : 'group'
                    }
                >
                    <button
                        onClick={() => callBack && callBack(i)}
                        class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 group-[.active]:text-blue-600 group-[.active]:bg-blue-100 group-[.active]:font-bold"
                    >
                        {i + 1}
                    </button>
                </li>
            );
        }

        if (
            endPage.value < totalPage.value &&
            realDisplayPage.value < totalPage.value - 1
        ) {
            items.push(
                <>
                    <li>
                        <span className="px-3 py-2 ">...</span>
                    </li>
                    <li>
                        <button
                            class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 group-[.active]:text-blue-600 group-[.active]:bg-blue-100 group-[.active]:font-bold"
                            onClick={() =>
                                callBack && callBack(totalPage.value - 1)
                            }
                        >
                            {totalPage.value}
                        </button>
                    </li>
                </>
            );
        }

        return items;
    };
    return (
        <nav aria-label="Page navigation example" {...rest}>
            <ul class="inline-flex items-center -space-x-px">
                <li>
                    <button
                        onClick={() => callBack && callBack(0)}
                        class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        <span class="sr-only">Previous</span>
                        <svg
                            aria-hidden="true"
                            class="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </li>
                {generateItems()}
                <li>
                    <button
                        onClick={() =>
                            callBack && callBack(totalPage.value - 1)
                        }
                        class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        <span class="sr-only">Next</span>
                        <svg
                            aria-hidden="true"
                            class="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
