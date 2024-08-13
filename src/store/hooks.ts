import { bindActionCreators } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { userActions } from "./slice/user-slice";
import { socketActions } from "./slice/socket-slice";

const actions = {
    ...userActions,
    ...socketActions
};

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(actions, dispatch);
}


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
