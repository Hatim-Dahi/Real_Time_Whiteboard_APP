import {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateDrawing, removeDrawing} from "../../redux/drawingSlice";
import Draw from "./Draw";
import {useDrawing} from "./useDrawing";
import ContainerResizeComponent from "../DndResizeRotateContainer/ContainerResizeComponent";
import RemoveObject from "../Layout/utils/RemoveObject";
import {removeShape} from "../../redux/shapesSlice";

const Drawing = ({isUsed, isUsable}) => {

    const dispatch = useAppDispatch()

    const [ctx, setContext] = useState()
    const [down, setDown] = useState(false)


    const canvasRef = useRef()
    const drawings = useAppSelector(state => state.present.drawing.drawings)
    const brush = useAppSelector(state => state.present.drawing.brush)


    const {
        handleDown,
        handleMove,
        handleUp,
        toggle,
        // draw,
    } = useDrawing(brush, canvasRef, ctx, down, setDown)

    useEffect(() => {

        if (isUsed) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            setContext(ctx)
            window.addEventListener('mousedown', handleDown)
            if (down) {
                window.addEventListener('mousemove', handleMove)
            }
            window.addEventListener('mouseup', handleUp)
            return () => {

                window.removeEventListener('mousemove', handleMove)
                window.removeEventListener('mousedown', handleDown)
                window.removeEventListener('mouseup', handleUp)

            }
        }
    }, [down, toggle, isUsed, brush, drawings])


    return (
        <>
            <canvas ref={canvasRef}></canvas>
        </>


    )


}


export default Drawing