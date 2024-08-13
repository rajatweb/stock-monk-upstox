import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICandleData } from "@/types/market";

const initialState: ICandleData[] = [

]

const socketSlice = createSlice({
    name: "socketSlice",
    initialState,
    reducers: {
        setRealTimeData: (state, { payload }: PayloadAction<ICandleData[]>) => {
            return [
                ...state,
                ...payload
            ]
        },
        updateRsi: (state, { payload }: PayloadAction<any>) => {
            Object.assign(state, {
                [payload]: {
                    rsi: payload,
                },
            });
        }
    }
});

export const socketActions = socketSlice.actions;
export const socketReducer = socketSlice.reducer;
