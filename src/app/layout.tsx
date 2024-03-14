'use client'

import './globals.css'
import {Inter} from 'next/font/google'
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";
import React from "react";
import {store} from "./redux/store";
import Head from 'next/head'


const inter = Inter({subsets: ['latin']})


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (

        <html lang="en">

        <Head>

            <meta name="viewport" content=" height=device-height, width=device-width,  initial-scale=1"/>

        </Head>
        <body className={inter.className}>
        <Provider store={store}>
                {children}
        </Provider>
        </body>

        </html>


    )
}
