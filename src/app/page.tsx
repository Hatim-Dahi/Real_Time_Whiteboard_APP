"use client"

import * as React from "react";
import Droppable from "./Components/Layout/utils/Droppable";
import SideBar from "./Components/Layout/SideBar";
import CurvesCanvas from "./Components/BezierCurves/CurvesCanvas";
import Drawing from "./Components/Drawing/Drawing";
import Selection from "./Components/Selection/Selection";
import TextTool from "./Components/TextObject/TextTool";
import RenderResizeShape from "./Components/shape/RenderResizeShape";
import RemoveObject from "./Components/Layout/utils/RemoveObject";
import {useHome} from "./useHome";
import {createContext, Dispatch, useState} from "react";
import LayersComponent from "./Components/Layout/LayersComponent";


export interface Point {
    x: number,
    y: number
}

interface Context {
    setOption: Dispatch<string>,
    setStart: Dispatch<Point>,
    setShapeId: Dispatch<number>,
    start: Point,
    shapeId: number
}


export const LevelContext = createContext<Context | null>(null);


function Home() {

    const [start, setStart] = useState<Point>({x: 0, y: 0})
    const [shapeId, setShapeId] = useState<number>(-1)


    const {
        option,
        setOption,
        setShape,
        handleRemoveShape,
        handleAddShape,
        shapes,
    } = useHome()

    return (

        <div className={'back'} onClick={handleAddShape}>

            <div className={'background'}/>
            {/*<Droppable>*/}
            <>
                <LevelContext.Provider value={{
                    setOption,
                    start,
                    setStart,
                    shapeId,
                    setShapeId
                }}>
                    {/*{shapes.map(shape => {*/}
                    {/*    return <RemoveObject key={shape.id} handleRemove={handleRemoveShape} id={shape.id}>*/}
                    {/*        <RenderResizeShape item={shape} setOption={setOption}/>*/}
                    {/*    </RemoveObject>*/}
                    {/*})}*/}
                    <CurvesCanvas add={option === "Curve"} setShape={setOption} isUsable={option}/>

                    <Selection isUsed={option === "Selection"}/>
                    <Drawing isUsed={option === "Drawing"} isUsable={option}/>
                    <LayersComponent isUsable={option}/>
                    <TextTool isUsed={option === "Text"} setOption={setOption}/>
                </LevelContext.Provider>


            </>
            {/*</Droppable>*/}
            <SideBar setShape={setShape} setOption={setOption} option={option}/>
        </div>
    )
}


export default Home