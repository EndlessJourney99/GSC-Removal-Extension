import { Signal, signal } from '@preact/signals';
import { createContext } from 'preact';

export interface tabContextProps {
    activeKey: Signal<string | number>;
}

export const TabContext = createContext<tabContextProps>({
    activeKey: signal(0),
});
