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
    MouseCoordinateY
} from "react-financial-charts";

const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d) => new Date(d.date)
);

interface IChartFeedProps {
    ticker: ICandleData[];
}

const ChartFeed: React.FC<IChartFeedProps> = ({ ticker }) => {
    const [chartData, setChartData] = useState<ICandleData[]>([]);
    const [timeStamp, setTimeStamp] = useState({});

    useEffect(() => {
        if (ticker && ticker.length) {
            ticker.forEach((res, idx) => {
                updateTimestamp(+new Date(res.date), res);
            });
        }

    }, [ticker]);

    useEffect(() => {
        const _arr = [].concat.apply([], Object.values(timeStamp))
        setChartData(_arr)
    }, [timeStamp]);


    // Function to update timestamp
    const updateTimestamp = (newTimestamp: number, data: ICandleData) => {
        setTimeStamp((prevState: any) => {
            // If the timestamp has changed, return a new object with the updated timestamp
            if (prevState.timestamp !== newTimestamp) {
                return {
                    ...prevState,
                    [newTimestamp]: [{ ...data }],
                    // data: [{ ...data }] // reset or update the data as needed
                };
            }
            // If the timestamp hasn't changed, return the same state
            return prevState;
        });
    };


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
            </Chart>
            <CrossHairCursor />
        </ChartCanvas>
    );
};

export default ChartFeed;