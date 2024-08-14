"use client";

import React, { useEffect, useState } from 'react';
import { useLazyGetSocketUriQuery } from '@/store/api/market-info';
import useLiveData from '@/store/hooks/useLiveData';
import ChartFeed from '@/components/organisms/chart-feed/chart-feed';
import { TimeStampData } from "@/lib/data";
import { useGetHistoricalTimeDataQuery } from "@/store/api/historical-data";
import { ICandleData } from '@/types/market';

const LiveFeed = () => {
    const { messages, setUrl, socketStatus, sendMessageWithDelay } = useLiveData();
    const [webSocketUrl, setWebSocketUrl] = useState("");
    const [candleData, setCandleData] = useState<ICandleData[]>([]);
    const { data } = useGetHistoricalTimeDataQuery({});

    const [currentData, setCurrentData] = useState<any>([]); // state to hold the current data sent to the child
    const [index, setIndex] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            // Send data to the child component from the array based on the current index
            setCurrentData((prevState: any) => [...prevState, TimeStampData[index]]);

            // Update the index to point to the next element
            setIndex(prevIndex => {
                const newIndex = prevIndex + 1;
                return newIndex < TimeStampData.length ? newIndex : 0; // loop back to the start if at the end
            });
        }, 1000); // change interval as needed

        return () => clearInterval(interval); // cleanup on unmount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, TimeStampData]);

    const [getSocketUrl] = useLazyGetSocketUriQuery();

    useEffect(() => {
        if (!webSocketUrl) {
            getSocketUrl()
                .unwrap()
                .then((res) => {
                    setWebSocketUrl(res.data.authorizedRedirectUri);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webSocketUrl]);

    useEffect(() => {
        if (webSocketUrl) {
            setUrl(webSocketUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webSocketUrl]);

    useEffect(() => {
        if (socketStatus) {
            const payload = {
                guid: "someguid",
                method: "sub",
                data: {
                    mode: "full",
                    instrumentKeys: ["NSE_INDEX|Nifty Bank"],
                },
            };
            sendMessageWithDelay(payload, 10);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketStatus]);

    useEffect(() => {
        if (data && data.status === "success") {
            const { candles } = data.data;
            if (candles.length) {
                const candleData = candles.map((candle: any, index: number) => {
                    return {
                        date: +new Date(candle[0]),
                        open: candle[1],
                        high: candle[2],
                        low: candle[3],
                        close: candle[4],
                        volume: candle[5]
                    }
                });
                

                // candleData.sort((a: any, b: any) => a.time - b.time);
                // setRealTimeData(candleData);
                setCandleData(candleData);
            }
        }
    }, [data]);

    return <ChartFeed ticker={[...candleData, ...currentData]} />;
}

export default LiveFeed
