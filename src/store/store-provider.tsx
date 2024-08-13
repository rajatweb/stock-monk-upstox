"use client";

import { useRef } from "react";
import { AppStore, store } from "./store";
import { Provider } from "react-redux";

interface IStoreProviderProps {
    children: React.ReactNode
}

export default function StoreProvider({
    children
}: IStoreProviderProps) {
    const storeRef = useRef<AppStore>();

    if (!storeRef.current) {
        storeRef.current = store();
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}
