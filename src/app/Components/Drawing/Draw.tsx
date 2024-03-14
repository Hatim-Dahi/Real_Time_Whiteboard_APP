import React, {memo, useContext, useEffect, useRef} from "react";
import ContainerResizeComponent from "../DndResizeRotateContainer/ContainerResizeComponent";
import {removeDrawing, updateDrawing} from "../../redux/drawingSlice";
import {draw} from "./useDrawing";
import RemoveObject from "../Layout/utils/RemoveObject";
import {useAppDispatch} from "../../redux/hooks";


const Draw = ({drawing, isUsable}) => {

    const dispatch = useAppDispatch()


    function saveChangesDrawing(object) {
        dispatch(updateDrawing(object))
    }

    // const out = new Path2D()
    // const inside = new Path2D()
    // const p = new Path2D()
    // out.rect(item.x - 15, item.y - 15, item.w + 30, item.h + 30)
    // p.rect(item.x, item.y, item.w, item.h)
    // inside.rect(item.x + 15, item.y + 15, item.w - 30, item.h - 30)


    return (
        <RemoveObject key={drawing.id} removeFunc={removeDrawing} id={drawing.id}>
            <ContainerResizeComponent
                isUsable={isUsable}
                editorObject={drawing}
                saveChanges={saveChangesDrawing}
                renderProp={(object) => <DrawObject object={object}/>}
            />
        </RemoveObject>
    )
}


const DrawObject = ({object}) => {

    const canvasRef = useRef()
    const dispatch = useAppDispatch()
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        draw(object, ctx,dispatch)
    }, [object.center.x, object.center.y, object.angle, object.style, object.down])


    return (
        <canvas ref={canvasRef}></canvas>
    )
}


export default Draw


