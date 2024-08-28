import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface CandlestickData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ScrollableCandlestickChartProps {
  data: CandlestickData[];
}

const ScrollableCandlestickChart: React.FC<ScrollableCandlestickChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(1000); // Initial width
  const [scrollWidth, setScrollWidth] = useState<number>(0);
  const [xDomain, setXDomain] = useState<[Date, Date]>([
    new Date(data[0].date), 
    new Date(data[data.length - 1].date)
  ]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const height = 400; // Adjust as needed

    // Set up SVG dimensions
    svg.attr('width', chartWidth)
       .attr('height', height);

    const xScale = d3.scaleTime()
      .domain(xDomain)
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.low) || 0, d3.max(data, d => d.high) || 0])
      .range([height, 0]);

    // Clear existing content
    svg.selectAll('*').remove();

    // Draw x-axis
    const xAxis = d3.axisBottom(xScale).ticks(d3.timeMinute.every(1));
    svg.append('g')
      .attr('transform', `translate(0, ${height - 20})`)
      .call(xAxis);

    // Draw y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .attr('transform', `translate(20, 0)`)
      .call(yAxis);

    // Draw candlesticks
    const candlestickWidth = 10; // Adjust as needed
    const candleGroup = svg.append('g')
      .attr('transform', `translate(20, 0)`);

    candleGroup.selectAll('line.high-low')
      .data(data)
      .enter().append('line')
      .attr('class', 'high-low')
      .attr('x1', d => xScale(d.date))
      .attr('x2', d => xScale(d.date))
      .attr('y1', d => yScale(d.high))
      .attr('y2', d => yScale(d.low))
      .attr('stroke', 'black');

    candleGroup.selectAll('rect.candle')
      .data(data)
      .enter().append('rect')
      .attr('class', 'candle')
      .attr('x', d => xScale(d.date) - candlestickWidth / 2)
      .attr('y', d => yScale(Math.max(d.open, d.close)))
      .attr('width', candlestickWidth)
      .attr('height', d => yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close)))
      .attr('fill', d => d.open > d.close ? 'red' : 'green');

    // Update scroll width
    setScrollWidth(xScale(d3.max(data, d => d.date) || new Date()) - xScale(d3.min(data, d => d.date) || new Date()));

  }, [data, chartWidth, xDomain]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollLeft = event.currentTarget.scrollLeft;
    const newDomain = [
      new Date(xDomain[0].getTime() + (scrollLeft / chartWidth) * (scrollWidth - chartWidth)),
      new Date(xDomain[0].getTime() + ((scrollLeft + chartWidth) / chartWidth) * (scrollWidth - chartWidth))
    ] as [Date, Date];
    setXDomain(newDomain);
  };

  return (
    <div
      ref={containerRef}
      style={{ overflowX: 'scroll', width: '100%' }}
      onScroll={handleScroll}
    >
      <svg ref={svgRef} />
    </div>
  );
};

export default ScrollableCandlestickChart;
