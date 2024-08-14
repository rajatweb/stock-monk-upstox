// src/components/CandlestickChart.tsx
import React, { useEffect, useState } from 'react';
import { ICandleData } from '@/types/market';
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize
} from "react-financial-charts";
import { useAppSelector } from '@/store/hooks';

const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
  (d) => new Date(d.date)
);
export interface CandlestickData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Props {
  cdata: ICandleData[];
}

const CandlestickChart: React.FC<Props> = ({ cdata }) => {
  const [chartData, setChartData] = useState<ICandleData[]>([]);
  useEffect(() => {
    setChartData(cdata)
  }, [cdata]);

  const height = 500;
  const width = 1600;
  const margin = { left: 0, right: 48, top: 0, bottom: 24 };

  const elder = elderRay();
  const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(
    chartData
  );
  const pricesDisplayFormat = format(".2f");
  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max + 5];

  const gridHeight = height - margin.top - margin.bottom;

  const elderRayHeight = 100;
  const elderRayOrigin = (_: any, h: any) => [0, h - elderRayHeight];
  const barChartHeight = gridHeight / 4;
  const barChartOrigin = (_: any, h: any) => [0, h - barChartHeight - elderRayHeight];
  const chartHeight = gridHeight - elderRayHeight;
  const yExtents = (data: any) => {
    return [data.high, data.low];
  };


  const dateTimeFormat = "%d %b";
  const timeDisplayFormat = timeFormat(dateTimeFormat);

  const barChartExtents = (data: any) => {
    return data.volume;
  };

  const candleChartExtents = (data: any) => {
    return [data.high, data.low];
  };

  const yEdgeIndicator = (data: any) => {
    return data.close;
  };

  const volumeColor = (data: any) => {
    return data.close > data.open
      ? "rgba(38, 166, 154, 0.3)"
      : "rgba(239, 83, 80, 0.3)";
  };

  const volumeSeries = (data: any) => {
    return data.volume;
  };

  const openCloseColor = (data: any) => {
    return data.close > data.open ? "#26a69a" : "#ef5350";
  };

  // useEffect(() => {
  //   if (!chartData || chartData.length === 0) return;

  //   const svg = d3.select(svgRef.current);
  //   const width = 800;
  //   const height = 400;
  //   const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  //   const innerWidth = width - margin.left - margin.right;
  //   const innerHeight = height - margin.top - margin.bottom;

  //   const tickFormat = (value: string) => {
  //     const date = new Date(value);
  //     return d3.timeFormat('%Y-%m-%d')(date);
  //   };

  //   // Clear previous contents
  //   svg.selectAll('*').remove();

  //   // Define scales
  //   const xScale = d3.scaleBand<string>()
  //     .domain(chartData.map(d => d.date.toISOString()))
  //     .range([margin.left, width - margin.right])
  //     .padding(0.2);

  //   const yScale = d3.scaleLinear()
  //     .domain([d3.min(chartData, d => d.low) || 0, d3.max(chartData, d => d.high) || 0])
  //     .nice()
  //     .range([height - margin.bottom, margin.top]);

  //   // Draw candlesticks
  //   svg.append('g')
  //     .selectAll('.candlestick')
  //     .data(chartData)
  //     .enter()
  //     .append('rect')
  //     .attr('class', 'candlestick')
  //     .attr('x', d => xScale(d.date.toISOString()) || 0)
  //     .attr('y', d => yScale(Math.max(d.open, d.close)))
  //     .attr('width', xScale.bandwidth())
  //     .attr('height', d =>  yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close)))
  //     .attr('fill', d => d.open > d.close ? 'red' : 'green');

  //   svg.append('g')
  //     .selectAll('.high-low')
  //     .data(chartData)
  //     .enter()
  //     .append('line')
  //     .attr('class', 'high-low')
  //     .attr('x1', d => (xScale(d.date.toISOString()) || 0) + xScale.bandwidth() / 2)
  //     .attr('x2', d => (xScale(d.date.toISOString()) || 0) + xScale.bandwidth() / 2)
  //     .attr('y1', d => yScale(d.high))
  //     .attr('y2', d => yScale(d.low))
  //     .attr('stroke', d => d.open > d.close ? 'red' : 'green');

  //   // Add x-axis
  //   svg.append('g')
  //     .attr('transform', `translate(0,${height - margin.bottom})`)
  //     .call(d3.axisBottom(xScale).tickFormat(tickFormat)) 
  //     .selectAll('text')
  //     .attr('transform', 'rotate(-45)')
  //     .style('text-anchor', 'end');

  //   // Add y-axis
  //   svg.append('g')
  //     .attr('transform', `translate(${margin.left},0)`)
  //     .call(d3.axisLeft(yScale));
  // }, [chartData]);

  return (
    <ChartCanvas
      height={height}
      ratio={3}
      width={width}
      margin={margin}
      data={data}
      displayXAccessor={displayXAccessor}
      seriesName="Data"
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
      zoomAnchor={lastVisibleItemBasedZoomAnchor}
    >
      <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
        <XAxis showGridLines showTicks={false} showTickLabel={false} />
        <YAxis showGridLines tickFormat={pricesDisplayFormat} />
        <CandlestickSeries />
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={pricesDisplayFormat}
        />
        <EdgeIndicator
          itemType="last"
          rectWidth={margin.right}
          fill={openCloseColor}
          lineStroke={openCloseColor}
          displayFormat={pricesDisplayFormat}
          yAccessor={yEdgeIndicator}
        />

        {/* <ZoomButtons /> */}
        <OHLCTooltip origin={[8, 16]} />
      </Chart>
      <Chart
        id={4}
        height={elderRayHeight}
        yExtents={[0, elder.accessor()]}
        origin={elderRayOrigin}
        padding={{ top: 8, bottom: 8 }}
      >
        <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
        <YAxis ticks={4} tickFormat={pricesDisplayFormat} />

        <MouseCoordinateX displayFormat={timeDisplayFormat} />
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={pricesDisplayFormat}
        />

        <ElderRaySeries yAccessor={elder.accessor()} />

        {/* <SingleValueTooltip
          yAccessor={elder.accessor()}
          yLabel="Elder Ray"
          // yDisplayFormat={(d) =>
          //   `${pricesDisplayFormat(d.bullPower)}, ${pricesDisplayFormat(
          //     d.bearPower
          //   )}`
          // }
          origin={[8, 16]}
        /> */}
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default CandlestickChart;
