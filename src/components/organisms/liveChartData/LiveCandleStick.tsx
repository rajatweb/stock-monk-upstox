// src/CandlestickChart.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Candle {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

const CandlestickChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<Candle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.timestamp) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.low) || 0, d3.max(data, d => d.high) || 0])
      .nice()
      .range([height, 0]);

    // Create x and y axes
    svg.append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeMinute.every(1)).tickFormat((d)=>d3.timeFormat('%H:%M:%S')(d as Date)));

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale));

    // Add candlesticks
    const candlesGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    candlesGroup.selectAll('.candle')
      .data(data)
      .enter().append('g')
      .attr('class', 'candle')
      .attr('transform', d => `translate(${xScale(d.timestamp)}, 0)`)
      .each(function(d) {
        const candleGroup = d3.select(this);

        // Draw wick
        candleGroup.append('line')
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', yScale(d.high))
          .attr('y2', yScale(d.low))
          .attr('stroke', d.open > d.close ? 'red' : 'green')
          .attr('stroke-width', 2);

        // Draw body
        candleGroup.append('rect')
          .attr('x', -2)
          .attr('y', yScale(Math.max(d.open, d.close)))
          .attr('width', 4)
          .attr('height', yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close)))
          .attr('fill', d.open > d.close ? 'red' : 'green');
      });

    // Add tooltip for better UX
    const tooltip = d3.select(svgRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // candlesGroup.selectAll('.candle')
    //   .on('mouseover', (event, d) => {
    //     tooltip.transition().duration(200).style('opacity', .9);
    //     tooltip.html(`Open: ${d.open}<br/>High: ${d.high}<br/>Low: ${d.low}<br/>Close: ${d.close}`)
    //       .style('left', `${event.pageX + 5}px`)
    //       .style('top', `${event.pageY - 28}px`);
    //   })
    //   .on('mouseout', () => {
    //     tooltip.transition().duration(500).style('opacity', 0);
    //   });
  }, [data, dimensions]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth - 40, height: 400 });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setData(prevData => {
        const newCandle: Candle = {
          timestamp: now,
          open: Math.random() * 100 + 100, // Mock data
          high: Math.random() * 10 + 110,
          low: Math.random() * 10 + 90,
          close: Math.random() * 10 + 100
        };
        // Update the last minute of data
        return [...prevData.filter(d => now.getTime() - d.timestamp.getTime() < 60000), newCandle];
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
  );
};

export default CandlestickChart;
