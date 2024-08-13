"use client";
import LiveChartData from "@/components/organisms/liveChartData/LiveChartData";
import { useLazyGetSocketUriQuery } from "@/store/api/market-info";
import useLiveData from "@/store/hooks/useLiveData";
import React, { useEffect, useState } from "react";

const LiveData = () => {
  const { messages, setUrl, socketStatus,sendMessageWithDelay } = useLiveData();
  const [webSocketUrl, setWebSocketUrl] = useState("");

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

  console.log(messages, "messages");

  React.useEffect(() => {
    if (webSocketUrl) {
      setUrl(webSocketUrl);
    }
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
      sendMessageWithDelay(payload,10);
    }
  }, [socketStatus]);

  return <LiveChartData data={messages}/>;
};

export default LiveData;
