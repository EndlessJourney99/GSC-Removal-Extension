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

export { compareHost };
