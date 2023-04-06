import { RemovalStatus, RemovalUrlDb } from './RemovalUrl';

interface ServiceMessage {
    Command: 'Request' | 'Response';
    TabId: number;
    OptionParameters?: any;
    Data?: any;
    FunctionName: string;
}

interface UrlRemovalResponse {
    updateData: RemovalUrlDb;
}

export type { ServiceMessage, UrlRemovalResponse };
