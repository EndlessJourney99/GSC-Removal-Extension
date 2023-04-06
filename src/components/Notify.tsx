import { Signal, useSignal } from '@preact/signals';
import { useLayoutEffect } from 'preact/hooks';

export type NotifyType = 'Success' | 'Error' | 'Warning';

type props = {
    msg: string;
    notifyType: NotifyType;
    timeOut: number;
    visible: Signal<boolean>;
};

const Notify = ({ msg, notifyType, timeOut, visible }: props) => {
    const styles = useSignal<string>('');

    useLayoutEffect(() => {
        if (visible.value === true) {
            setTimeout(() => {
                visible.value = false;
            }, timeOut);

            switch (notifyType) {
                case 'Success':
                    styles.value = 'bg-teal-500';
                    break;
                case 'Warning':
                    styles.value = 'bg-yellow-500';
                    break;
                case 'Error':
                    styles.value = 'bg-red-300';
                    break;
                default:
                    styles.value = 'hidden';
                    break;
            }
        }
    }, [visible.value]);

    return (
        <>
            {visible.value ? (
                <div
                    className={`w-full rounded-md text-white p-4 font-bold ${styles.value}`}
                >
                    {notifyType === 'Success' ? '🎉' : '🧨'} {msg}
                </div>
            ) : (
                ''
            )}
        </>
    );
};

export default Notify;
