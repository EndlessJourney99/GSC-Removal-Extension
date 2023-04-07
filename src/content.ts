import { RemovalOptions, RemoveMethod, RemoveType } from './hooks/useRemoval';
import { BackgroundMessage, ServiceMessage } from './types/Execution';
import { RemovalStatus, RemovalUrlDb } from './types/RemovalUrl';

let _GLOBAL_STATUS_FLAG_ = false;
//message listener for background
chrome.runtime.onMessage.addListener(function (
    message: ServiceMessage,
    sender,
    sendResponse
) {
    if (message.Command === 'Start') {
        _GLOBAL_STATUS_FLAG_ = true;
        startRemove(message.Data, message.OptionParameters);
    } else if (message.Command === 'Stop') {
        _GLOBAL_STATUS_FLAG_ = false;
    } else if (message.Command === 'CheckStatus') {
        sendResponse(_GLOBAL_STATUS_FLAG_);
    }
});

const checkCurrentUrl = (): boolean => {
    const currentUrl = document.URL;
    const matchedUrl = currentUrl.match(/^.*search-console\/removals.*$/gm);
    return matchedUrl !== null && matchedUrl.length > 0;
};

const BackdropShield = (isAppend: boolean) => {
    if (isAppend) {
        const overlay = document.createElement('div');
        overlay.setAttribute(
            'style',
            'position: absolute; left:0; top:0; width: 100%; height:100%; background-color: #00000040; z-index: 999999'
        );
        overlay.setAttribute('id', 'gsc-backdrop-shield');
        document.body.appendChild(overlay);
    } else document.body.querySelector('#gsc-backdrop-shield')?.remove();
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForElm<T>(selector: string, timeout: number = 3000): Promise<T> {
    return new Promise((resolve, reject) => {
        let observer: MutationObserver;
        let rejectTimeout: number;

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

        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
            characterDataOldValue: true,
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
        Array.from(
            modalElem
                .querySelector('div[jsname="KYYiw"]')
                ?.querySelectorAll('span[role="tabpanel"][jsname="PAiuue"]') ??
                new Array<Element>()
        )
            .find((el) => el.classList.length > 1)
            ?.querySelector<HTMLButtonElement>(
                'div[role="radio"][jscontroller="EcW08c"][data-value="yNQTT"]'
            )
            ?.click();
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
        ?.querySelector<HTMLButtonElement>(
            'div[role="button"][jsname="LgbsSe"][data-id="EBS5u"]'
        );
    submitBtn?.click();

    const resultPanel = await waitForElm<HTMLDivElement>(
        'div[role="dialog"][jscontroller="N5Lqpc"][aria-labelledby*="dwrFZd"]'
    );

    // URL not in property
    if (
        resultPanel &&
        resultPanel.querySelectorAll(
            'div:not([jsname="r4nke"]) > div[jsname="c6xFrd"] > div[role="button"][jsname="LgbsSe"]'
        ).length <= 1
    ) {
        resultPanel
            .querySelector<HTMLButtonElement>(
                'div[role="button"][jsname="LgbsSe"]'
            )
            ?.click();
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

        // const firstRowURL = document
        //     .querySelector('div[jscontroller="prqp7d"]')
        //     ?.querySelector('div[jsname="KYYiw"]')
        //     ?.querySelector('span[role="tabpanel"]')
        //     ?.querySelector(
        //         'table tbody tr:first-child td:first-child span'
        //     )?.textContent;

        // if (firstRowURL === removeUrl.URL) return 'Done'; // Starts with: https://khanhtran17520630.blogspot.com/aaaa. CO STARTS WITH
        return 'Done';
    }
};

async function startRemove(data: Array<RemovalUrlDb>, options: RemovalOptions) {
    BackdropShield(true);

    if (!checkCurrentUrl()) {
        const anchorElem = document
            .querySelector("[jsname='d9j7kc']")
            ?.querySelector(
                "a[href^='./search-console/removals']"
            ) as HTMLAnchorElement;
        if (anchorElem !== null && anchorElem !== undefined) anchorElem.click();
    }
    for (let i = 0; i < data.length; i++) {
        if (!_GLOBAL_STATUS_FLAG_) break;
        const Url = data[i];
        try {
            await clickNewRequestBtn();
            const result = await processRemoveUrl(Url, options);
            processResponse(Url, result);
            await sleep(options.Delays * 1000);
        } catch (Err) {
            console.error(Err);
            processResponse(Url, 'Failed');
        }
    }
    _GLOBAL_STATUS_FLAG_ = false;
    BackdropShield(false);
    chrome.runtime.sendMessage<BackgroundMessage>({
        Command: 'Completed',
    });
}

function processResponse(data: RemovalUrlDb, result: RemovalStatus) {
    data.Status = result;
    chrome.runtime.sendMessage<BackgroundMessage>({
        Command: 'UpdateData',
        UpdateData: data,
    });
}

async function clickNewRequestBtn() {
    (
        document.querySelector(
            'div[role="button"][jscontroller="VXdfxd"][jsname="LgbsSe"]'
        ) as HTMLButtonElement
    )?.click();
    await sleep(500);
    document
        .querySelector<HTMLButtonElement>(
            'div[role="button"][jscontroller="VXdfxd"][jsname="Hf7sUe"]'
        )
        ?.click();

    const modalElem = await waitForElm<HTMLDivElement>(
        'div[role="dialog"][jscontroller="N5Lqpc"]'
    );

    let isModalAppear = false;
    let tried = 0;
    while (!isModalAppear) {
        try {
            if (modalElem !== null) isModalAppear = true;
            else
                (
                    document.querySelector(
                        'div[role="button"][jscontroller="VXdfxd"][jsname="Hf7sUe"]'
                    ) as HTMLButtonElement
                ).click();
        } catch (Err) {
            tried++;
            console.warn(`wait for modal ${tried} times!`);

            document
                .querySelector<HTMLButtonElement>(
                    'div[role="button"][jscontroller="VXdfxd"][jsname="Hf7sUe"]'
                )
                ?.click();
        }
    }
}
