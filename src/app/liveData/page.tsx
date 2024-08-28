"use client";
import LiveChartData from "@/components/organisms/liveChartData/LiveChartData";
import { useLazyGetSocketUriQuery } from "@/store/api/market-info";
import useLiveData from "@/store/hooks/useLiveData";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface CandleData {
    date: string;
    open: number;
    close: number;
    high: number;
    low: number;
  }

const LiveData = () => {

  const { messages,data,setUrl, socketStatus,sendMessage } = useLiveData();
  const [webSocketUrl, setWebSocketUrl] = useState("");

  const [getSocketUrl] = useLazyGetSocketUriQuery();

  const [tempData, setTempDate] = useState<CandleData[]>([]);

  console.log(data,'data')

  useEffect(() => {
    const generateData = () => {
      const startDate = new Date('2024-01-01T00:00:00Z');
      const endDate = new Date('2024-01-01T23:59:00Z');
      const data: CandleData[] = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        data.push({
          date: currentDate.toISOString(),
          open: Math.random() * 100,
          close: Math.random() * 100,
          high: Math.random() * 100,
          low: Math.random() * 100,
        });
        currentDate = new Date(currentDate.getTime() + 60000); // Increment by 1 minute
      }

      return data;
    };

    const newData = generateData();
    setTempDate(newData);
  }, []);

//   useEffect(() => {
//     if (!webSocketUrl) {
//       getSocketUrl()
//         .unwrap()
//         .then((res) => {
//           setWebSocketUrl(res.data.authorizedRedirectUri);
//         });
//     }else {
//         setUrl(webSocketUrl);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [webSocketUrl]);

//   React.useEffect(() => {
//     if (socketStatus) {
//       const payload = {
//         guid: "someguid",
//         method: "sub",
//         data: {
//           mode: "full",
//           instrumentKeys: ["NSE_INDEX|Nifty Bank"],
//         },
//       };
//       sendMessage(payload);
//     }
//   }, [socketStatus]);



  return <LiveChartData data={data}/>;
};

export default LiveData;
