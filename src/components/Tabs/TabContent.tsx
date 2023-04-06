import React, { useContext } from 'preact/compat';
import { TabContext, tabContextProps } from './TabContext';

interface props extends React.HTMLAttributes<HTMLDivElement> {
    children: JSX.Element | JSX.Element[];
}

const TabContent = ({ children, ...props }: props) => {
    return (
        <div id="myTabContent" {...props}>
            {children}
        </div>
    );
};

export default TabContent;
