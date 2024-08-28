// src/components/CandlestickChart.tsx
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { ICandleData } from "@/types/market";
import moment from "moment";
import { ScaleLinear, ScaleTime } from "d3";
import Brush from "@/components/atoms/CandleChart/Brush";

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
  x: number;
  y1: number;
  y2: number;
  color: string;
};

type CandleLineProps = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  color: string;
};

type BrushSpecsType ={
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    width: number;
    height: number;
}

const CandlestickChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [xScale, setXScale] = useState<ScaleTime<number, number> | null>(null);
  const [yScale, setYScale] = useState<ScaleLinear<number, number> | null>(null);
  const [dimensions,setDimensions] = useState<{width:number,height:number}|null>(null);
  const [brushSpec,setBrushSpecs] = useState<BrushSpecsType|null>(null)
  
  const startTime = moment().clone().set({ hour: 9, minute: 30 });

  const initialBrush = startTime.clone().add(30,'minutes')

  const [brushExtent,setBrushExtent] = useState<string[]|null>(null)

  const margin= { top: 30, right:30, bottom:10, left: 30 }
  const seperationRatio= 0.9;

useEffect(()=>{
    if(!dimensions){
        if (!svgRef.current) return;
            const svgWidth = svgRef.current.clientWidth;
            const svgHeight = svgRef.current.clientHeight;
            setDimensions({width:svgWidth,height:svgHeight})
            setBrushSpecs({
                margin: { top: 20, right:30, bottom:10, left: 50 },
                width: svgWidth,
                height: svgHeight * (1 - seperationRatio)
        })

    }

},[dimensions])


useEffect(()=>{

    if(data.length){
        const startTime = moment(data[data.length-1].date);
        const endTime = moment().clone().set({ hour: 15, minute:0 });
        if(!brushExtent){
            if(startTime.isAfter(endTime)){
                const startDate = endTime.clone().add(1,'minutes').format('llll');
                const endDate = endTime.clone().add(31,'minutes').format('llll')
                setBrushExtent([startDate,endDate]);
            } else {
                const startDate = startTime.clone().format('llll');
                const endDate = startTime.clone().add(30,'minutes').format('llll');
                setBrushExtent([startDate,endDate]);
            }

        }

    }

},[data])


 //Create scales and axe

  useEffect(() => {
    if (!svgRef.current) return;

    if(dimensions && brushExtent){

        const width = dimensions.width - margin.left - margin.right;
        const height = (dimensions.height*seperationRatio) - margin.top - margin.bottom;
    
        const xScale = d3
          .scaleTime()
          .range([0,width-20])
          .domain([new Date(brushExtent[0]), new Date(brushExtent[1])]);
    
        const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]).nice();
    
        const svg = d3.select(svgRef.current);
        svg.selectAll(".x-axis").remove(); // Clear previous conten
        svg.selectAll(".y-axis").remove();
        // Update x axi
        svg
          .append("g")
          .attr('class', 'x-axis')
          .attr("transform", `translate(${margin.left+20},${height + margin.top})`)
          .call(
            d3
              .axisBottom(xScale)
              .ticks(d3.timeMinute.every(1))
              .tickFormat((d) => d3.timeFormat("%H:%M")(d as Date))
          )
          .selectAll("text");
    
        // Update y axis
        svg
          .append("g")
          .attr('class', 'y-axis')
          .attr("transform", `translate(${margin.left},${margin.top})`)
          .call(d3.axisLeft(yScale).ticks(50));
    
        setXScale(() => xScale);
        setYScale(() => yScale);

    }

  }, [dimensions,brushExtent]);

    useEffect(() => {
      if (!svgRef.current || !xScale || !yScale) return;

      const svg = d3.select(svgRef.current);
      svg.select(".candle-group").remove(); // Clear previous conten

      // Draw candlesticks
      const candlesGroup = svg.append("g").attr("class", "candle-group").attr("transform", `translate(${margin.left+20},${margin.top})`);

      candlesGroup
        .selectAll(".candle")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "candle")
        .each(function (d) {
          const candleGroup = d3.select(this);

          candleGroup
            .append("line")
            .attr("x1", xScale(new Date(d.date)))
            .attr("x2", xScale(new Date(d.date)))
            .attr("y1", yScale(d.high))
            .attr("y2", yScale(d.low))
            .attr("stroke", d.open > d.close ? "red" : "green");

          candleGroup
            .append("rect")
            .attr("x", (xScale(new Date(d.date)) as number) - 5) // Width of the candlestick
            .attr("y", Math.min(yScale(d.open), yScale(d.close)))
            .attr("width", 10) // Width of the candlestick
            .attr("height", Math.abs(yScale(d.open) - yScale(d.close)))
            .attr("fill", d.open > d.close ? "red" : "green");
        });
    }, [data, xScale, yScale]);

  return (
    <div className="w-full h-[700px]">
    <svg ref={svgRef} width={'100%'} height={'100%'}>
        {dimensions&& <g transform={`translate(0,${dimensions.height * seperationRatio})`}>
            {brushSpec && brushExtent && <Brush brushSpecs={brushSpec} setBrushExtent={setBrushExtent} brushExtent={brushExtent}/>}
        </g>}
        </svg>

    </div>
  );
};

export default CandlestickChart;
