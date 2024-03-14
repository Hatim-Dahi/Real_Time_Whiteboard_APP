import {useCallback, useEffect, useRef} from "react";
import {useCanvas} from "./useCanvas";
import {useAppDispatch} from "../../../redux/hooks";
import {setPath} from "../../../redux/shapesSlice";
import {configureContext, setShapeInfo, useGetItemStyle} from "./Rectangle";


const Ellipse = ({item}) => {

    const dispatch = useAppDispatch()
    const object = useGetItemStyle(item)


    const draw = useCallback(((item, ctx) => {
        const radiusX = Math.abs(item.w / 2)
        const radiusY = Math.abs(item.h / 2)
        const centerX = Math.abs(item.x + radiusX)
        const centerY = Math.abs(item.y + radiusY)

        const out = new Path2D()
        const inside = new Path2D()
        const p = new Path2D()

        configureContext(ctx, item, ()=>{
            ctx.ellipse(centerX, centerY, radiusX, radiusY, Math.PI, 0, 2 * Math.PI)
        })


        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radiusX, radiusY, Math.PI, 0, 2 * Math.PI)
        ctx.stroke()
        out.ellipse(centerX, centerY, radiusX + 15, radiusY + 30, Math.PI, 0, 2 * Math.PI)
        p.ellipse(centerX, centerY, radiusX, radiusY, Math.PI, 0, 2 * Math.PI)
        inside.ellipse(centerX, centerY, Math.abs(radiusX - 15), Math.abs(radiusY - 30), Math.PI, 0, 2 * Math.PI)
        setShapeInfo(dispatch, item, out, p , inside)



    }).bind(null, object), [object.center.x, object.center.y, object.angle, object.style,object.down])
    const ref = useCanvas(draw)

    return (

        <canvas ref={ref}></canvas>
    )

}

export default Ellipse