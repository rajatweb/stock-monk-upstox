// src/components/CandlestickChart.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { ICandleData } from '@/types/market';

export interface CandlestickData {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
  }

interface Props {
  data: ICandleData[];
}

const CandlestickChart: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [chartData,setChartData] = useState<ICandleData[]>( [
        {
          date: new Date(1723108500),
          open: 50051.9,
          high: 50179,
          low: 49956.6,
          close: 50121.85
        },
        {
          date: new Date(1723108560),
          open: 50118.45,
          high: 50159.5,
          low: 50096.3,
          close: 50143.2
        },
        {
          date: new Date(1723108620),
          open: 50146.8,
          high: 50183.95,
          low: 50137.7,
          close: 50181
        },
        {
          date: new Date(1723108680),
          open: 50184.8,
          high: 50185.55,
          low: 50122.85,
          close: 50126.75
        },
        {
          date: new Date(1723108740),
          open: 50126.1,
          high: 50150.55,
          low: 50106.05,
          close: 50130.4
        },
        {
          date: new Date(1723108800),
          open: 50124.3,
          high: 50138.5,
          low: 50092.15,
          close: 50117.1
        },
        {
          date: new Date(1723108860),
          open: 50119.5,
          high: 50119.5,
          low: 50086.7,
          close: 50110.7
        }
    ]);

    useEffect(()=>{
        // setChartData(data)

    },[data])
  
    useEffect(() => {
      if (!chartData || chartData.length === 0) return;
  
      const svg = d3.select(svgRef.current);
      const width = 800;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const tickFormat = (value: string) => {
        const date = new Date(value);
        return d3.timeFormat('%Y-%m-%d')(date);
      };
  
      // Clear previous contents
      svg.selectAll('*').remove();
  
      // Define scales
      const xScale = d3.scaleBand<string>()
        .domain(chartData.map(d => d.date.toISOString()))
        .range([margin.left, width - margin.right])
        .padding(0.2);
  
      const yScale = d3.scaleLinear()
        .domain([d3.min(chartData, d => d.low) || 0, d3.max(chartData, d => d.high) || 0])
        .nice()
        .range([height - margin.bottom, margin.top]);
  
      // Draw candlesticks
      svg.append('g')
        .selectAll('.candlestick')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'candlestick')
        .attr('x', d => xScale(d.date.toISOString()) || 0)
        .attr('y', d => yScale(Math.max(d.open, d.close)))
        .attr('width', xScale.bandwidth())
        .attr('height', d =>  yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close)))
        .attr('fill', d => d.open > d.close ? 'red' : 'green');
  
      svg.append('g')
        .selectAll('.high-low')
        .data(chartData)
        .enter()
        .append('line')
        .attr('class', 'high-low')
        .attr('x1', d => (xScale(d.date.toISOString()) || 0) + xScale.bandwidth() / 2)
        .attr('x2', d => (xScale(d.date.toISOString()) || 0) + xScale.bandwidth() / 2)
        .attr('y1', d => yScale(d.high))
        .attr('y2', d => yScale(d.low))
        .attr('stroke', d => d.open > d.close ? 'red' : 'green');
  
      // Add x-axis
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(tickFormat)) 
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
  
      // Add y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));
    }, [chartData]);
  
    return (
      <svg ref={svgRef} width={800} height={400}></svg>
    );
  };
  
  export default CandlestickChart;
