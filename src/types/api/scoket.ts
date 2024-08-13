// export type ISocketPayload = {
//     t: string,
//     uid?: string,
//     actid?: string,
//     susertoken?: string,
//     source?: string,
//     k?: any
// }

type IData = {
    mode: String
    instrumentKeys: [String]
}

export type ISocketPayload = {
    guid: String
    method: String
    data: IData
}

export interface SocketRes {
    type: string
    feeds: Feeds
}

export interface Feeds {
    [x: string]: NseIndexNiftyBank
}

export interface NseIndexNiftyBank {
    ff: Ff
}

export interface Ff {
    indexFF: IndexFf
}

export interface IndexFf {
    ltpc: Ltpc
    marketOHLC: MarketOhlc
    lastClose: number
    yh: number
    yl: number
}

export interface Ltpc {
    ltp: number
    ltt: string
    ltq: string
    cp: number
}

export interface MarketOhlc {
    ohlc: Ohlc[]
}

export interface Ohlc {
    interval: string
    open: number
    high: number
    low: number
    close: number
    volume: number
    ts: string
}
