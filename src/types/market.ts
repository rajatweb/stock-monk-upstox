export type IWatchList = {
    idxname: string
    token: string
}

export type ICandleData = {
    open: number
    high: number
    low: number
    close: number
    time: any
    interval?: string
    volume?: number
    rsi?: any
}