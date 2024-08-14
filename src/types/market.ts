export type IWatchList = {
    idxname: string
    token: string
}

export type ICandleData = {
    open: number
    high: number
    low: number
    close: number
    date: Date | string
    interval?: string
    volume?: number
}