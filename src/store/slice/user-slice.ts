import { IUser } from "@/types/user";
import { getAppLocalStorageByName } from "@/lib/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userInfo = getAppLocalStorageByName("userInfo");

const initialState: IUser = {
    email: "",
    exchanges: [],
    products: [],
    broker: "",
    user_id: "",
    user_name: "",
    order_types: [],
    user_type: "",
    poa: false,
    is_active: false,
    access_token: "",
    extended_token: ""
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUserInfo: (_, { payload }: PayloadAction<IUser>) => {
            return payload
        }
    }
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
