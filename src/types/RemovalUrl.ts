interface RemovalUrlCsv {
    URL: string;
    LastCrawled: string;
}

type RemovalStatus = 'Done' | 'Failed' | 'Url_Not_In_Property' | 'Queue';

interface RemovalUrlDb extends RemovalUrlCsv {
    id?: any;
    Status: RemovalStatus;
}

export type { RemovalUrlCsv, RemovalUrlDb, RemovalStatus };
