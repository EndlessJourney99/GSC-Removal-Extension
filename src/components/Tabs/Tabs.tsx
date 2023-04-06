import { useSignal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { TabContext } from './TabContext';
import React from 'preact/compat';

interface props extends React.HTMLAttributes<HTMLElement> {
    children: JSX.Element | JSX.Element[];
    defaultKey: string | number;
}

const Tabs = ({ children, defaultKey, ...rest }: props) => {
    const activeTab = useSignal(defaultKey);
    return (
        <TabContext.Provider value={{ activeKey: activeTab }}>
            <section key="Tabs" {...rest}>
                {children}
            </section>
        </TabContext.Provider>
    );
};

export default Tabs;
