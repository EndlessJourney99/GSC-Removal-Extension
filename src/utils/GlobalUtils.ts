const dbName = 'db';
const compareHost = (url1: string[], url2: string): boolean => {
    if (!url1.length || !url2.length) return false;
    const urlObj2 = new URL(url2);

    for (let i = 0; i < url1.length; i++) {
        const urlObj1 = new URL(url1[i]);
        console.log(url1[i], url2);
        if (urlObj1.hostname == urlObj2.hostname) return true;
    }
    return false;
};

function readCsvFile<T>(file: File): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const csvString = event.target?.result as string;
            const lines = csvString.split('\n');
            const headers = lines[0].split(',');
            const data = new Array<T>();

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].split(',');
                let row: any = {};
                for (let j = 0; j < headers.length; j++) {
                    row[headers[j]] = line[j];
                }
                data.push(row as T);
            }

            resolve(data);
        };

        reader.onerror = (event) => {
            reject(event.target?.error);
        };

        reader.readAsText(file);
    });
}

export { compareHost, readCsvFile, dbName };
