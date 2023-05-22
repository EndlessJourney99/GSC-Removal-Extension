import { RemovalStatus, RemovalUrlDb } from './RemovalUrl';

export type Commands = 'Start' | 'Stop' | 'CheckStatus';

interface ServiceMessage {
    Command: Commands;
    OptionParameters?: any;
    Data?: any;
}

interface BackgroundMessage {
    Command: 'HandShake' | 'UpdateData' | 'Completed' | 'Display_Error';
    UpdateData?: RemovalUrlDb;
}

export type { ServiceMessage, BackgroundMessage };
