export interface IOptionChainResponse {
    data: IOptionChain[]
    status: string
}

export interface IOptionChain {
    expiry: string
    pcr: number
    strike_price: number
    underlying_key: string
    underlying_spot_price: number
    call_options: IOptionsMeta
    put_options: IOptionsMeta
}

export interface IOptionsMeta {
    instrument_key: string
    market_data: IMarketData
    option_greeks: IOptionGreeks
}

export interface IMarketData {
    ltp: number
    volume: number
    oi: number
    close_price: number
    bid_price: number
    bid_qty: number
    ask_price: number
    ask_qty: number
    prev_oi: number
}

export interface IOptionGreeks {
    vega: number
    theta: number
    gamma: number
    delta: number
    iv: number
}