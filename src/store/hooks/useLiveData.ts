import { FeedResponse, FullFeed } from "@/proto/marketDataFeed_pb";
import { ISocketPayload } from "@/types/api/scoket";
import { useEffect, useState, useRef } from "react";
import { ICandleData } from "@/types/market";

const blobToArrayBuffer = async (blob: Blob) => {
  if ("arrayBuffer" in blob) return await blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject();
    reader.readAsArrayBuffer(blob);
  });
};

const useLiveData = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [webSocketUrl, setWebSocketUrl] = useState("");
  const [messages, setMessages] = useState<ICandleData[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [messagePayload, setMessagePayload] = useState<{ payload: Buffer, delay: number } | null>(null)

  useEffect(() => {
    if (webSocketUrl && !socket) {
      const ws = new WebSocket(webSocketUrl);
      ws.onmessage = async (event: MessageEvent) => {
        try {
          const arrayBuffer = await blobToArrayBuffer(event.data);
          let buffer = Buffer.from(arrayBuffer as ArrayBuffer);
          let response = FeedResponse.fromBinary(buffer);
          const FullFeed = response.feeds["NSE_INDEX|Nifty Bank"].FeedUnion
            .value as FullFeed;
          if (FullFeed && FullFeed?.FullFeedUnion?.value?.marketOHLC) {
            const finalValue =
              FullFeed?.FullFeedUnion?.value?.marketOHLC.ohlc[1];
            const timeStamp = Number(finalValue.ts)
            const message = {
              open: finalValue.open,
              close: finalValue.close,
              high: finalValue.high,
              low: finalValue.low,
              date: new Date(timeStamp),
            };
            setMessages((values) => [...values, message]);
          }
        } catch (e) {
          console.log(e, "error");
        }

        // setMessages((prevMessages) => [...prevMessages, event.data]);
      };

      ws.onopen = () => {
        setSocket(ws);
      };

      ws.onclose = () => {
        console.log("On Close")
      };
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear timeout if the component unmounts
      }

    }
  }, [webSocketUrl]);

  useEffect(() => {
    if (socket && messagePayload) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear timeout if the component unmounts
      }
      socket.send(messagePayload.payload);
      timeoutRef.current = setInterval(() => {
        socket.send(messagePayload.payload);
      }, messagePayload.delay);

      return () => {
        console.log("Request return")
        if (timeoutRef.current) {
          clearInterval(timeoutRef.current); // Clean up interval on unmount or disconnection
        }
      };
    }
  }, [socket, messagePayload]);

  const sendMessage = (message: ISocketPayload) => {
    const payload = Buffer.from(JSON.stringify(message));
    if (socket) {
      socket.send(payload);
    }
  };

  const sendMessageWithDelay = (message: ISocketPayload, delay: number) => {
    const payload = Buffer.from(JSON.stringify(message));
    setMessagePayload({ payload, delay: 1000 * delay })
  };


  const setUrl = (url: string) => {
    setWebSocketUrl(url);
  };




  return { messages, sendMessage, setUrl, socketStatus: !!socket, sendMessageWithDelay };
};

export default useLiveData;
