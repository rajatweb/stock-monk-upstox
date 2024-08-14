"use client";
import LiveChartData from "@/components/organisms/liveChartData/LiveChartData";
import { useGetHistoricalTimeDataQuery } from "@/store/api/historical-data";
import { useLazyGetSocketUriQuery } from "@/store/api/market-info";
import { useActions } from "@/store/hooks";
import useLiveData from "@/store/hooks/useLiveData";
import { ICandleData } from "@/types/market";
import React, { useEffect, useState } from "react";

import { ITimeStampData, timeStampData } from "@/lib/data";

const LiveData = () => {
  const [candleData, setCandleData] = useState<ICandleData[]>([]);
  const [liveCandleData, setLiveCandleData] = useState<any[]>([]);
  console.log("🚀 ~ LiveData ~ liveCandleData:", liveCandleData)
  const { messages, setUrl, socketStatus, sendMessageWithDelay } = useLiveData();
  const [webSocketUrl, setWebSocketUrl] = useState("");
  const { data } = useGetHistoricalTimeDataQuery({});

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
    if (data && data.status === "success") {
      const { candles } = data.data;
      if (candles.length) {
        const candleData = candles.map((candle: any, index: number) => {
          return {
            time: candle[0],
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5],
            oi: candle[6]
          }
        });

        // candleData.sort((a: any, b: any) => a.time - b.time);
        // setRealTimeData(candleData);
        setCandleData(candleData);
      }
    }
  }, [data]);

  // console.log(messages, "messages");  

  useEffect(() => {
    const arr: ICandleData[] = [];
    const candleByGroup: ITimeStampData = timeStampData;

    for (let candleTimeStamp in candleByGroup) {
      const findIndex = candleData.findIndex(c => +new Date(c.date) === +candleTimeStamp);
      if (findIndex === -1) {
        candleByGroup[candleTimeStamp].forEach((r) => {
          arr.push({
            open: r.open,
            high: r.high,
            low: r.low,
            close: r.close,
            date: r.date
          });
        });
      } else {
        candleByGroup[candleTimeStamp].forEach((r) => {
          arr[findIndex] = {
            open: r.open,
            high: r.high,
            low: r.low,
            close: r.close,
            date: r.date
          }
        });
      }

      setLiveCandleData((prevState) => [...prevState, arr]);
    }

    // console.log("🚀 ~ useEffect ~ arr:", arr)

  }, [messages]);

  React.useEffect(() => {
    if (webSocketUrl) {
      setUrl(webSocketUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webSocketUrl]);


  React.useEffect(() => {
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

  return candleData && candleData.length && <LiveChartData cdata={[...candleData]} />;
};

export default LiveData;
