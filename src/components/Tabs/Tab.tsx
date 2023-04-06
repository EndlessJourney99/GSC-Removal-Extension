import { useContext } from 'preact/hooks';
import { TabContext, tabContextProps } from './TabContext';
import { computed, useSignal } from '@preact/signals';

type props = {
    tabKey: string | number;
    children: string;
    icon?: JSX.Element;
};

const Tab = ({ tabKey, children, icon }: props) => {
    const state: tabContextProps = useContext(TabContext);
    const isActive = computed(() =>
        state.activeKey.value === tabKey ? true : false
    );
    const tabClick = () => {
        if (state.activeKey.peek() !== tabKey) state.activeKey.value = tabKey;
    };

    return (
        <li className={isActive.value ? 'active mr-2 group' : 'mr-2 group'}>
            <button
                key={tabKey}
                onClick={tabClick}
                className="inline-flex p-4 pl-0 border-b-2 border-transparent rounded-t-lg hover:text-blue-500 group-[.active]:text-blue-600 hover:border-blue-500 group-[.active]:border-blue-600"
            >
                {icon} &nbsp; {children}
            </button>
        </li>
    );
};

export default Tab;

{
    /* <svg
    aria-hidden="true"
    className="w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-500 group-[.active]:text-blue-600"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
        clip-rule="evenodd"
    ></path>
</svg>; */
}
