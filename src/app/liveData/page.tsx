"use client";
import LiveChartData from "@/components/organisms/liveChartData/LiveChartData";
import { useLazyGetSocketUriQuery } from "@/store/api/market-info";
import useLiveData from "@/store/hooks/useLiveData";
import moment from "moment";
import React, { useEffect, useState } from "react";

const LiveData = () => {
  const { messages,data,setUrl, socketStatus,sendMessage } = useLiveData();
  const [webSocketUrl, setWebSocketUrl] = useState("");

  const [getSocketUrl] = useLazyGetSocketUriQuery();

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

  console.log(data.map(item => moment(item.date).format()), "messages");

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
