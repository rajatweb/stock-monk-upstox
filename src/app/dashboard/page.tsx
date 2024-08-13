"use client";

import React, { useEffect, useState } from 'react';
import ContentLayout from '@/components/atoms/content/content-layout';
import { WatchList } from '@/components/organisms/scripts';
import TvChart from '@/components/atoms/tv-chart/tv-chart';
import { useGetHistoricalTimeDataQuery } from '@/store/api/historical-data';
import { useActions } from '@/store/hooks';

import { useSetupSocketQuery } from '@/store/api/socket-api';
import { useLazyGetSocketUriQuery } from '@/store/api/market-info';
import { timeToLocal } from '@/lib/utils';
import Chain from '@/components/organisms/chain/chain';
import { rsi } from 'indicatorts';
const defaultConfig = { period: 14 };


const Dashboard = () => {
    const [webSocketUrl, setWebSocketUrl] = useState("");
    const { setRealTimeData } = useActions();

    const [getSocketUrl] = useLazyGetSocketUriQuery();
    const { data } = useGetHistoricalTimeDataQuery({});
    // const { data: realData } = useSetupSocketQuery(webSocketUrl ? webSocketUrl : '');

    useEffect(() => {
        if (!webSocketUrl) {
            getSocketUrl().unwrap().then(res => {
                setWebSocketUrl(res.data.authorizedRedirectUri);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webSocketUrl]);


    useEffect(() => {
        if (data && data.status === "success") {
            const { candles } = data.data;
            if (candles.length) {
                const candleClosePrice = candles.map((candle: any) => candle[4])
                const result = rsi(candleClosePrice, defaultConfig);
                const candleData = candles.map((candle: any, index: number) => {
                    return {
                        time: timeToLocal(+new Date(candle[0])),
                        open: candle[1],
                        high: candle[2],
                        low: candle[3],
                        close: candle[4],
                        rsi: result[index]
                    }
                });

                candleData.sort((a: any, b: any) => a.time - b.time);
                setRealTimeData(candleData);
            }
        }
    }, [data]);

    return (
        <ContentLayout
            pageMeta={{
                title: "Dashboard",
                description: "Manage your Orders"
            }}
            WatchList={<WatchList handleWatchListSelect={() => { }} />}
        >
            <TvChart />
            <Chain />
        </ContentLayout>
    )
}

export default Dashboard
