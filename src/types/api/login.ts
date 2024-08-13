
export type IUserTokenRequest = {
    code: string,
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    grant_type?: string
}

export type IUserTokenResponse = {
    email: string
    exchanges: string[]
    products: string[]
    broker: string
    user_id: string
    user_name: string
    order_types: string[]
    user_type: string
    poa: boolean
    is_active: boolean
    access_token: string
    extended_token: string
}
