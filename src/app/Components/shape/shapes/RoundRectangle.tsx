import {useCallback, useEffect, useRef} from "react";
import {useCanvas} from "./useCanvas";
import {useAppDispatch} from "../../../redux/hooks";
import {setPath} from "../../../redux/shapesSlice";
import {configureContext, setShapeInfo, useGetItemStyle} from "./Rectangle";


const RoundRectangle = ({item}) => {

    const dispatch = useAppDispatch()
    const object = useGetItemStyle(item)


    const draw = useCallback(((item, ctx)=>{


        const out = new Path2D()
        const inside = new Path2D()
        const p = new Path2D()


        configureContext(ctx, item, ()=>{
            ctx.roundRect(item.x, item.y, item.w, item.h, 20)
        })

        ctx.beginPath();
        ctx.roundRect(item.x, item.y, item.w, item.h, 20)
        ctx.stroke()


        out.roundRect(item.x-15, item.y-15, item.w+30, item.h+30, 20)
        p.roundRect(item.x, item.y, item.w, item.h, 20)
        inside.roundRect(item.x+15, item.y+15, item.w-30, item.h-30, 20)


        setShapeInfo(dispatch, item, out, p , inside)



    }).bind(null, object) , [object.center.x, object.center.y, object.angle, object.style,object.down])



    const ref = useCanvas(draw)


    return (

        <canvas  ref={ref}></canvas>
    )

}

export default RoundRectangle