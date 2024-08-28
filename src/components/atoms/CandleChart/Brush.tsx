import * as d3 from 'd3';
import moment from 'moment';
import React, { useEffect, useRef } from 'react'

type BrushProps ={
    brushSpecs: {
        margin: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        };
        width: number;
        height: number;
    };
    setBrushExtent: React.Dispatch<React.SetStateAction<string[] | null>>;
    brushExtent: string[];
}

const Brush = ({brushSpecs:{margin,width,height},setBrushExtent,brushExtent}:BrushProps) => {

    const brushRef = useRef<SVGGElement|null>(null);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const startTime = moment().clone().set({ hour: 9, minute: 30 });
    const endTime = moment().clone().set({ hour: 15, minute: 30 });


    const xScale = d3.scaleTime()
      .range([0,innerWidth])
      .domain([new Date(startTime.format('llll')), new Date(endTime.format('llll'))]);


    useEffect(()=>{

        if(!brushRef.current) return ;
        const brush = d3.select(brushRef.current);
        brush.selectAll("*").remove(); // Clear previous conten
        // Update x axi
        brush
          .append("g")
          .attr("transform", `translate(0,${innerHeight/2})`)
          .attr('class', 'brush-x-axis')
          .call(
            d3
              .axisBottom(xScale)
              .ticks(d3.timeMinute.every(30))
              .tickFormat((d) => d3.timeFormat("%H:%M")(d as Date))
          )
          .selectAll("text");

    },[])

    useEffect(() => {
        if(!brushRef.current) return ;
        const brush = d3.brushX()
            .extent([[0, 0], [innerWidth, innerHeight]])
            .handleSize(0)
            .on('brush', (event) => {
                console.log(event.selection.map(xScale.invert),'event selection')
                setBrushExtent(event.selection.map((d:Date)=>moment(xScale.invert(d)).format('llll')))
               // setBrushExtent(event.selection && event.selection.map(scaleBandInvert(xScale)))
            });
        const brushObj = d3.select(brushRef.current);
        brush(brushObj);
        brush.move(brushObj, [xScale(new Date(brushExtent[0])), xScale(new Date(brushExtent[1]))]);
        brushObj.selectAll('.handle').remove();
        brushObj.selectAll('.overlay').remove();

    }, []);


  return (
    <g ref={brushRef} transform={`translate(${margin.left},${margin.top})`}/>
  )
}

export default Brush