// src/components/CandlestickChart.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { ICandleData } from '@/types/market';
import moment from 'moment';

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

type CandleProps = {
    x:number;
    y1:number;
    y2:number;
    color:string;
}

type CandleLineProps = {
    x1:number;
    x2:number;
    y1:number;
    y2:number;
    color:string;
}



const CandlestickChart: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 600 });
    const [localDate,setLocalDate] = useState(new Date);

    const margin = { top: 20, right: 20, bottom: 80, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const xScale = d3.scaleTime().range([0,width]);
    xScale.domain([new Date(moment(localDate).subtract(1, 'minutes').format()), new Date(moment(localDate).add(10, 'minutes').format())]);
      // Create scales and axe

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    
    const yScale = d3.scaleLinear().range([height, 0]);

    // Update x and y scales
    yScale.domain([d3.min(data, d => d.low) || 0, d3.max(data, d => d.high) || 0]).nice();

    // Update x axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},${height+margin.top})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeMinute.every(1)).tickFormat(d=>d3.timeFormat('%H:%M:%S')(d as Date)))
      .selectAll('text')

    // Update y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale));

    // Draw candlesticks
    const candlesGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    candlesGroup.selectAll('.candle')
      .data(data)
      .enter().append('g')
      .attr('class', 'candle')
      .each(function(d) {
        const candleGroup = d3.select(this);

        // Draw wick
        // candleGroup.append('line')
        //   .attr('x1', 0)
        //   .attr('x2', 0)
        //   .attr('y1', yScale(d.high))
        //   .attr('y2', yScale(d.low))
        //   .attr('stroke', d.open > d.close ? 'red' : 'green')
        //   .attr('stroke-width', 2);

        candleGroup.append('line')
            .attr('x1', xScale(new Date(d.date)))
            .attr('x2', xScale(new Date(d.date)))
            .attr('y1', yScale(d.high))
            .attr('y2', yScale(d.low))
            .attr('stroke', d.open > d.close ? 'red' : 'green');

        

        candleGroup.append('rect')
            .attr('x', xScale(new Date(d.date)) as number - 5) // Width of the candlestick
            .attr('y', Math.min(yScale(d.open),yScale(d.close)))
            .attr('width', 10) // Width of the candlestick
            .attr('height', Math.abs(yScale(d.open) - yScale(d.close)))
            .attr('fill', d.open > d.close ? 'red' : 'green');
        // candleGroup.append('rect')
        //   .attr('x', -2)
        //   .attr('y', yScale(Math.max(d.open, d.close)))
        //   .attr('width', 4)
        //   .attr('height', yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close)))
        //   .attr('fill', d.open > d.close ? 'red' : 'green');
      });

  }, [data, dimensions]);



    // useEffect(()=>{
    //     setChartData(data)
    // },[data])
  
    // useEffect(() => {
    //   if (!svgRef.current) return;

  
    //   const svg = d3.select(svgRef.current);
  
    //   svg.selectAll('*').remove(); // Clear existing content
  
    //   const xScale = d3.scaleBand().range([0, width]).domain(d3.extent(chartData, d => {
    //     return moment(d.date).clone().format('DD HH:MM')
    //   }) as string[]);
    //   const yScale = d3.scaleLinear().range([height, 0]).domain([d3.min(chartData, d => d.low) || 0, d3.max(data, d => d.high) || 0]);

    //   const xAxis = d3.axisBottom(xScale);
    //   const yAxis = d3.axisLeft(yScale);

    // const svgGroup = svg
    //   .attr('width', dimensions.width)
    //   .attr('height', dimensions.height)
    //   .append('g')
    //   .attr('transform', `translate(${margin.left},${margin.top})`);

    // svgGroup
    //   .append('g')
    //   .attr('class', 'x-axis')
    //   .attr('transform', `translate(${margin.left},${height})`)
    //   .call(xAxis);

    // svgGroup
    //   .append('g')
    //   .attr('class', 'y-axis')
    //   .call(yAxis);

    // //   const candles = data.map((item)=>({
    // //       x: xScale(item.date),
    // //       y1: Math.min(yScale(item.open),yScale(item.close)),
    // //       y2: yScale(Math.min(item.open, item.close)) - yScale(Math.max(item.open, item.close)),
    // //       color: item.open > item.close ? 'red' : 'green'
    // //   }));

    // //   const candleLines = data.map((item)=>({
    // //     x1: xScale(item.date),
    // //     x2: xScale(item.date),
    // //     y1: yScale(item.high),
    // //     y2: yScale(item.low),
    // //     color: item.open > item.close ? 'red' : 'green'
    // // }));

    // // setCandleSticks(candles);
    // // setCandleStickLines(candleLines);

  
    //   svgGroup
    //     .selectAll('.candlestick')
    //     .data(chartData)
    //     .enter()
    //     .append('g')
    //     .attr('class', 'candlestick')
    //     .each(function(d) {
    //       const g = d3.select(this);
    //       const xData = moment(d.date).clone().format('DD HH:MM') as string || '';
        //   g.append('line')
        //     .attr('x1', xScale(xData) as number)
        //     .attr('x2', xScale(xData) as number)
        //     .attr('y1', yScale(d.high))
        //     .attr('y2', yScale(d.low))
        //     .attr('stroke', 'black');
  
    //       g.append('rect')
    //         .attr('x', xScale(xData) as number - 5) // Width of the candlestick
    //         .attr('y', Math.min(yScale(d.open),yScale(d.close)))
    //         .attr('width', 10) // Width of the candlestick
    //         .attr('height', Math.abs(yScale(d.open) - yScale(d.close)))
    //         .attr('fill', d.open > d.close ? 'red' : 'green');
    //     });
  
    //   const handleResize = () => {
    //     const newWidth = svgRef.current?.parentElement?.offsetWidth || 1200;
    //     setDimensions(prev => ({ ...prev, width: newWidth }));
    //   };
  
    //   window.addEventListener('resize', handleResize);
    //   return () => window.removeEventListener('resize', handleResize);
  
    // }, [chartData, dimensions]);
  
    return (
      <div style={{ overflowX: 'auto'}} className="w-full h-full">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} ></svg>
        {/* {candleSticks.map((item,idx)=> <div key={idx} style={{
            left: item.x + 'px',
            bottom: item.y1 + 'px',
            border:`5px solid ${item.color}`,
            height:`${item.y2}px`,
            transform:`translate(${margin.left}px,0px`
          }}
          className='absolute'
          >

        </div>)} */}
      </div>
    );
  };
  
  export default CandlestickChart;
