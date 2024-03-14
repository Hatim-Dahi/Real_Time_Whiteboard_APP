'use client'
import {Provider} from "react-redux";
import React, {useEffect, useState} from "react";
import {store, persistor} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import dynamic from 'next/dynamic'
import {persistStore} from 'redux-persist'


export const Providers = (props) => {

    const [persist, setPersist] = useState(persistStore(store))

    return (
        <>
            <Provider store={store}>
                <PersistGate loading={<div>LOADING...</div>} persistor={persist}>
                    {props.children}
                </PersistGate>


            </Provider>


        </>
    )
}


