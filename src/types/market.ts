export type IWatchList = {
    idxname: string
    token: string
}

export type ICandleData = {
    open: number
    high: number
    low: number
    close: number
    date: Date | number
    interval?: string
    volume?: number
    rsi?: any
}