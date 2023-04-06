import { JSX } from 'preact/jsx-runtime';

type Props = {
    children: JSX.Element | JSX.Element[];
};

const TabHeader = ({ children }: Props) => {
    return (
        <div className="border-b border-gray-200 ">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 ">
                {children}
            </ul>
        </div>
    );
};

export default TabHeader;
