import React, { useContext } from 'preact/compat';
import { TabContext, tabContextProps } from './TabContext';
import { computed } from '@preact/signals';

interface props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
    children: JSX.Element | JSX.Element[];
    tabKey: string | number;
}

const TabPanel = ({ children, tabKey, ...rest }: props) => {
    const state: tabContextProps = useContext(TabContext);
    const isActive = computed(() =>
        state.activeKey.value === tabKey ? true : false
    );

    return (
        <>
            {isActive.value ? (
                <div
                    {...rest}
                    key={tabKey}
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                >
                    {children}
                </div>
            ) : (
                ''
            )}
        </>
    );
};

export default TabPanel;
