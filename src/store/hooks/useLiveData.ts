import { FeedResponse, FullFeed } from "@/proto/marketDataFeed_pb";
import { ISocketPayload } from "@/types/api/scoket";
import { useEffect, useState, useRef } from "react";
import { ICandleData } from "@/types/market";
import moment from "moment";

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
  const [data, setData] = useState<ICandleData[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [messagePayload, setMessagePayload] = useState<{
    payload: Buffer;
    delay: number;
  } | null>(null);

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
          if (FullFeed && FullFeed?.FullFeedUnion?.value?.marketOHLC && FullFeed.FullFeedUnion.value?.ltpc?.ltp ){
            const finalValue = FullFeed?.FullFeedUnion.value.marketOHLC.ohlc[1];
            const timeStamp = Number(finalValue.ts);
            const lastTradedPrice = FullFeed.FullFeedUnion.value.ltpc.ltp;
            if(!messages.length){
                const message = {
                    open: lastTradedPrice,
                    close:lastTradedPrice,
                    high: lastTradedPrice,
                    low: lastTradedPrice,
                    date: moment(timeStamp).format('llll'),
                  };
                setMessages([message])
            } else{
                const lastMessage = messages[messages.length-1];
                if(moment(timeStamp).diff(moment(lastMessage.date),'minutes') ===1){
                    const message = {
                        open: lastTradedPrice,
                        close:lastTradedPrice,
                        high: lastTradedPrice,
                        low: lastTradedPrice,
                        date: moment(timeStamp).format('llll'),
                      };
                    setMessages((values)=>[...values,message])
                } else {
                    const newMessage = {
                        ...lastMessage,
                        ...lastTradedPrice>lastMessage.high&&{high:lastTradedPrice},
                        ...lastTradedPrice<lastMessage.low &&{low:lastTradedPrice},
                        close: lastTradedPrice
                    }
                    const updatedMessages = [...messages];
                    updatedMessages[updatedMessages.length-1] = newMessage;
                    setMessages(updatedMessages)
                }

            }
          }
        } catch (e) {
          console.log(e, "error");
        }
      };

      ws.onopen = () => {
        setSocket(ws);
      };

      ws.onclose = () => {
        console.log("On Close");
      };
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear timeout if the component unmounts
      }
    };
  }, [webSocketUrl, socket]);

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
        console.log("Request return");
        if (timeoutRef.current) {
          clearInterval(timeoutRef.current); // Clean up interval on unmount or disconnection
        }
      };
    }
  }, [socket, messagePayload]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeStamp = new Date().getTime();
      const lastTradedPrice = Math.random() * 100;
      if(!data.length){
          const message = {
              open: lastTradedPrice,
              close:lastTradedPrice,
              high: lastTradedPrice,
              low: lastTradedPrice,
              date: moment(timeStamp).format('llll'),
            };
          setData([message])
      } else{
        const updatedMessages = [...data];
          const lastMessage = updatedMessages[updatedMessages.length-1];
       // console.log(moment(lastMessage.date).format(),"lastMessageDate",moment(timeStamp).format(),'TimesTamp',moment(timeStamp).diff(moment(lastMessage.date),'minutes'))
          if(moment(timeStamp).diff(moment(lastMessage.date),'minutes') ===1){
              const message = {
                  open: lastTradedPrice,
                  close:lastTradedPrice,
                  high: lastTradedPrice,
                  low: lastTradedPrice,
                  date: moment(timeStamp).format('llll'),
                };
                setData((values)=>[...values,message])
          } else {
              const newMessage = {
                  ...lastMessage,
                  ...lastTradedPrice>lastMessage.high&&{high:lastTradedPrice},
                  ...lastTradedPrice<lastMessage.low &&{low:lastTradedPrice},
                  close: lastTradedPrice
              }
              updatedMessages[updatedMessages.length-1] = newMessage;
              setData(updatedMessages)
          }

      }
    //   setData(prevData => {
    //     const newCandle:ICandleData = {
    //       date: now.getTime(),
    //       open: Math.random() * 100 + 100, // Mock data
    //       high: Math.random() * 10 + 110,
    //       low: Math.random() * 10 + 90,
    //       close: Math.random() * 10 + 100
    //     };
    //     // Update the last minute of data
    //     return [ newCandle];
    //   });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [data]);

  const sendMessage = (message: ISocketPayload) => {
    const payload = Buffer.from(JSON.stringify(message));
    if (socket) {
      socket.send(payload);
    }
  };

  const sendMessageWithDelay = (message: ISocketPayload, delay: number) => {
    const payload = Buffer.from(JSON.stringify(message));
    setMessagePayload({ payload, delay: 1000 * delay });
  };

  const setUrl = (url: string) => {
    setWebSocketUrl(url);
  };

  return {
    data,
    messages,
    sendMessage,
    setUrl,
    socketStatus: !!socket,
    sendMessageWithDelay,
  };
};

export default useLiveData;
