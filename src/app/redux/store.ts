'use client'

import {combineReducers, configureStore} from '@reduxjs/toolkit'
import undoable, {includeAction} from 'redux-undo';
import shapeReducer, {updateShape, addShape, addStyle, removeShape} from './shapesSlice'
import curveReducer, {updateCurve, addCurve} from './curvesSlice'
import drawingReducer, {updateDrawing, addDrawing, removeDrawing} from './drawingSlice'
import textReducer, {updateTextObject, addText} from './textSlice'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";


const rootReducer = undoable(combineReducers({
        shape: shapeReducer,
        text: textReducer,
        curve: curveReducer,
        drawing: drawingReducer,
    }),
    {
        limit: 20,
        filter: includeAction([
            updateShape.type,
            addShape.type,
            removeShape.type,
            addStyle.type,
            updateCurve.type,
            addCurve.type,
            updateDrawing.type,
            addDrawing.type,
            removeDrawing.type,
            updateTextObject.type,
            addText.type
        ]),
    })


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch