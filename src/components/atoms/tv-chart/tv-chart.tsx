import { useEffect, useRef } from 'react';
import { ColorType, createChart } from 'lightweight-charts';
import { useActions, useAppSelector } from '@/store/hooks';

import { rsi } from 'indicatorts';
const defaultConfig = { period: 14 };



const TvChart = () => {
  const { updateRsi } = useActions();
  const stockData = useAppSelector(state => state.socketRealTimeData);
  const chartContainerRef = useRef<any>();

  useEffect(() => {
    if(stockData) {
      // const candleClosePrice = stockData.map((candle: any) => candle.close)
      // const result = rsi(candleClosePrice, defaultConfig);
      // stockData.map(res => updateRsi(result));
    }
  }, [stockData]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' }
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      grid: {
        vertLines: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
        horzLines: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: true,
      },
    });
    const series = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    });


    const markers: any  = [];

    for (let i = 0; i < stockData.length; i++) {
      if (stockData[i].rsi >= 70) {
        markers.push({
          time: stockData[i].time,
          position: 'aboveBar',
          color: '#e91e63',
          shape: 'arrowDown',
          text: 'Sell @ ' + Math.floor(stockData[i].high + 2),
        });
      } else if (stockData[i].rsi <= 30) {
        markers.push({
          time: stockData[i].time,
          position: 'belowBar',
          color: '#2196F3',
          shape: 'arrowUp',
          text: 'Buy @ ' + Math.floor(stockData[i].low - 2),
      });
      }
    }


    series.setMarkers(markers);

    if (stockData.length) {
      // console.log("🚀 ~ useEffect ~ stockData:", stockData.length);
      series.setData(stockData);
      chart.timeScale().fitContent();
    }
    return () => {
      chart.remove()
    }
  }, [stockData]);

  return (
    <>
    <div ref={chartContainerRef}></div>
    <button>Update RSI</button>
    </>
  )
}

export default TvChart