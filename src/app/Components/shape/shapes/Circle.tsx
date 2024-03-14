import {useCallback, useEffect, useRef} from "react";
import {useCanvas} from "./useCanvas";
import {setPath} from "../../../redux/shapesSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {configureContext, setShapeInfo, useGetItemStyle} from "./Rectangle";


const Circle = ({item}) => {

    const dispatch = useAppDispatch()
    const object = useGetItemStyle(item)


    const draw = useCallback(((item, ctx) => {

        const out = new Path2D()
        const inside = new Path2D()
        const p = new Path2D()

        configureContext(ctx, item, ()=>{
            ctx.arc(item.x + item.w / 2, item.y + item.w / 2, Math.abs(item.w / 2), 0, 2 * Math.PI);
        })


        ctx.beginPath()
        ctx.arc(item.x + item.w / 2, item.y + item.w / 2, Math.abs(item.w / 2), 0, 2 * Math.PI);
        ctx.stroke()

        out.arc(item.x + item.w / 2, item.y + item.w / 2, Math.abs((item.w / 2)+30), 0, 2 * Math.PI);
        p.arc(item.x + item.w / 2, item.y + item.w / 2, Math.abs(item.w / 2), 0, 2 * Math.PI);
        inside.arc(item.x + item.w / 2, item.y + item.w / 2, Math.abs((item.w / 2)-30), 0, 2 * Math.PI);


        setShapeInfo(dispatch, item, out, p , inside)



    }).bind(null, object), [object.center.x, object.center.y, object.angle, object.style,object.down])
    const ref = useCanvas(draw)


    return (
        <canvas ref={ref}></canvas>
    )

}

export default Circle