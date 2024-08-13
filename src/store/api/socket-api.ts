import { ISocketPayload } from '@/types/api/scoket';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store';
import { Buffer } from "buffer";

import { FeedResponse } from "../../proto/marketDataFeed_pb";
import { socketActions } from '../slice/socket-slice';
import { timeToLocal } from '@/lib/utils';
import { ICandleData } from '@/types/market';

const blobToArrayBuffer = async (blob: Blob) => {
    if ("arrayBuffer" in blob) return await blob.arrayBuffer();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject();
        reader.readAsArrayBuffer(blob);
    });
};

// const WSS_URL = process.env.NEXT_PUBLIC_APP_UPSTOX_WSS_URL || "";
let newSocket: WebSocket;
const socket = (WSS_URL: string) => {
    newSocket = new WebSocket(
        `${WSS_URL}`
    );
    return newSocket;
};


// Webscoket send data 
export const sendData = (payload: ISocketPayload | {}) => {
    if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        const requestString = Buffer.from(JSON.stringify(payload));
        newSocket.send(requestString);
        console.log("Request: ", requestString);
    } else {
        console.error("WebSocket not connected");
    }
};

export const socketApi = createApi({
    reducerPath: 'socketApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).userData.access_token

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
                headers.set('Accept', `*/*`);
            }

            return headers
        },
    }),
    endpoints: (builder) => ({
        setupSocket: builder.query({
            query: (wssUrl) => ({
                url: `/`,
                responseHandler: (response) => response.text(),
            }),
            async onCacheEntryAdded(
                arg,
                {
                    updateCachedData,
                    cacheDataLoaded,
                    cacheEntryRemoved,
                    dispatch
                }
            ) {
                let intervalId: ReturnType<typeof setInterval>;
                const ws = socket(arg);
                ws.addEventListener("open", () => {
                    console.log("WebSocket connection successfully established");
                    const data = {
                        guid: "someguid",
                        method: "sub",
                        data: {
                            mode: "full",
                            instrumentKeys: ["NSE_INDEX|Nifty Bank"],
                        },
                    };
                    ws.send(Buffer.from(JSON.stringify(data)));
                    // sendData(Buffer.from(JSON.stringify(data)));
                    // Send a heartbeat every 2 minutes to keep the connection alive
                    intervalId = setInterval(() => {
                        // sendData(Buffer.from(JSON.stringify(data)));
                        ws.send(Buffer.from(JSON.stringify(data)));
                    }, 1000 * 60);
                });
                ws.addEventListener("close", () => {
                    console.log("WebSocket disconnect");
                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                });

                try {
                    await cacheDataLoaded;

                    const finalObject: ICandleData = {
                        open: 0,
                        high: 0,
                        low: 0,
                        close: 0,
                        time: '',
                    };

                    const listener = async (event: MessageEvent) => {
                        const arrayBuffer = await blobToArrayBuffer(event.data);
                        let buffer = Buffer.from(arrayBuffer as ArrayBuffer);
                        let response = FeedResponse.fromBinary(buffer);
                        const FullFeed = response.feeds["NSE_INDEX|Nifty Bank"].FeedUnion.value;
                        const finalValue = FullFeed?.FullFeedUnion?.value?.marketOHLC.ohlc[1];
                        // console.log("🚀 ~ listener ~ finalValue:", finalValue);

                        // dispatch(socketActions.setRealTimeData([{
                        //     open: finalValue.open,
                        //     close: finalValue.close,
                        //     high: finalValue.high,
                        //     low: finalValue.low,
                        //     time: timeToLocal(+new Date(parseInt(finalValue.ts)))
                        // }]));

                    }

                    ws.addEventListener('message', listener)
                } catch {
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                    // in which case `cacheDataLoaded` will throw
                }
                // cacheEntryRemoved will resolve when the cache subscription is no longer active
                await cacheEntryRemoved
                // perform cleanup steps once the `cacheEntryRemoved` promise resolves
                ws.close()
            },
        }),
    }),
})

export const { useSetupSocketQuery } = socketApi;
