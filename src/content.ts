import { RemovalOptions, RemoveMethod, RemoveType } from './hooks/useRemoval';
import { ServiceMessage, UrlRemovalResponse } from './types/Execution';
import { RemovalStatus, RemovalUrlDb } from './types/RemovalUrl';

//message listener for background
chrome.runtime.onMessage.addListener(function (
    message: ServiceMessage,
    sender,
    sendResponse
) {
    if (message.Command === 'Request') {
        switch (message.FunctionName) {
            case 'startRemove':
                startRemove(message.Data, message.OptionParameters);
                break;
            default:
                break;
        }
    }
    sendResponse({ msg: 'test' });
});

const checkCurrentUrl = (): boolean => {
    const currentUrl = document.URL;
    const matchedUrl = currentUrl.match(/^.*search-console\/removals.*$/gm);
    return matchedUrl !== null && matchedUrl.length > 0;
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForElm<T>(selector: string, timeout: number = 3000): Promise<T> {
    let observer: MutationObserver;
    let rejectTimeout: number;

    return new Promise((resolve, reject) => {
        rejectTimeout = setTimeout(() => {
            observer.disconnect();
            reject(
                new Error(
                    `Timeout waiting for element with selector: ${selector}`
                )
            );
        }, timeout);

        if (document.querySelector(selector)) {
            clearTimeout(rejectTimeout);
            return resolve(document.querySelector(selector) as T);
        }

        observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                clearTimeout(rejectTimeout);
                resolve(document.querySelector(selector) as T);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

const processRemoveUrl = async (
    removeUrl: RemovalUrlDb,
    options: RemovalOptions
): Promise<RemovalStatus> => {
    const modalElem = await waitForElm<HTMLDivElement>(
        'div[role="dialog"][jscontroller="N5Lqpc"]'
    );
    if (options.RemoveType === RemoveType.Clear_Cached)
        (
            modalElem.querySelector(
                'div[role="tab"][jscontroller="ragstd"][jsname="AznF2e"][aria-controls="riss7c"]'
            ) as HTMLButtonElement
        ).click();

    await sleep(100);

    if (options.Methods === RemoveMethod.URLS_PREFIX) {
        (
            Array.from(
                modalElem
                    .querySelector('div[jsname="KYYiw"]')
                    ?.querySelectorAll(
                        'span[role="tabpanel"][jsname="PAiuue"]'
                    ) ?? new Array<Element>()
            )
                .find((el) => el.classList.length > 1)
                ?.querySelector(
                    'div[role="radio"][jscontroller="EcW08c"][data-value="yNQTT"]'
                ) as HTMLInputElement
        ).click();
    }

    await sleep(100);

    const inputElem = Array.from(
        modalElem
            .querySelector('div[jsname="KYYiw"]')
            ?.querySelectorAll('span[role="tabpanel"][jsname="PAiuue"]') ??
            new Array<Element>()
    )
        .find((el) => el.classList.length > 1)
        ?.querySelector('div[jscontroller="EF8pe"]')
        ?.querySelector('input[jsname="YPqjbf"]') as HTMLInputElement;
    inputElem.value = removeUrl.URL;
    inputElem.dispatchEvent(
        new Event('input', {
            bubbles: true,
            cancelable: true,
        })
    );

    const submitBtn = modalElem
        .querySelector('div[jsname="c6xFrd"]')
        ?.querySelector(
            'div[role="button"][jsname="LgbsSe"][data-id="EBS5u"]'
        ) as HTMLButtonElement;
    submitBtn.click();

    const resultPanel = await waitForElm<HTMLDivElement>(
        'div[role="dialog"][jscontroller="N5Lqpc"][aria-labelledby*="dwrFZd"]',
        2000
    );

    // URL not in property
    if (
        resultPanel &&
        resultPanel.querySelectorAll(
            'div:not([jsname="r4nke"]) > div[jsname="c6xFrd"] > div[role="button"][jsname="LgbsSe"]'
        ).length <= 1
    ) {
        (
            resultPanel.querySelector(
                'div[role="button"][jsname="LgbsSe"]'
            ) as HTMLButtonElement
        ).click();
        return 'Url_Not_In_Property';
    } else {
        const submitBtn = resultPanel.querySelector(
            'div[role="button"][jsname="LgbsSe"][data-id="EBS5u"]'
        ) as HTMLButtonElement;
        if (submitBtn === null) return 'Failed';
        submitBtn.click();
        const progressElem = await waitForElm<HTMLDivElement>(
            'div[jscontroller="ltDFwf"][role="progressbar"]',
            3000
        );

        let count = 0;
        while (document.body.contains(progressElem)) {
            count++;
            await sleep(100);
            if (count === 50) break;
        }

        const firstRowURL = document
            .querySelector('div[jscontroller="prqp7d"]')
            ?.querySelector('div[jsname="KYYiw"]')
            ?.querySelector('span[role="tabpanel"]')
            ?.querySelector(
                'table tbody tr:first-child td:first-child span'
            )?.textContent;
        if (firstRowURL === removeUrl.URL) return 'Done';
        return 'Failed';
    }
};

async function startRemove(data: Array<RemovalUrlDb>, options: RemovalOptions) {
    if (!checkCurrentUrl()) {
        const anchorElem = document
            .querySelector("[jsname='d9j7kc']")
            ?.querySelector(
                "a[href^='./search-console/removals']"
            ) as HTMLAnchorElement;
        if (anchorElem !== null && anchorElem !== undefined) anchorElem.click();
    }
    clickNewRequestBtn();
    for (let i = 0; i < data.length; i++) {
        const Url = data[i];
        try {
            const result = await processRemoveUrl(Url, options);
            processResponse(Url, result);
            await sleep(options.Delays * 1000);
            if (result === 'Done') clickNewRequestBtn();
        } catch (Err) {
            console.error(Err);
            processResponse(Url, 'Failed');
        }
    }
}

function processResponse(data: RemovalUrlDb, result: RemovalStatus) {
    data.Status = result;
    chrome.runtime.sendMessage<UrlRemovalResponse>({
        updateData: data,
    });
}

function clickNewRequestBtn() {
    (
        document.querySelector(
            'div[role="button"][jscontroller="VXdfxd"][jsname="Hf7sUe"]'
        ) as HTMLButtonElement
    ).click();
}
