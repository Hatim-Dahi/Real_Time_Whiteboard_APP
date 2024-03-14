import {useCallback} from "react";
import {useCanvas} from "./useCanvas";
import {setPath} from "../../../redux/shapesSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {configureContext, setShapeInfo, useGetItemStyle} from "./Rectangle";


const Triangle = ({item}) => {

    const dispatch = useAppDispatch()
    const object = useGetItemStyle(item)

     const draw = useCallback(((item, ctx) => {

        const out = new Path2D()
        const inside = new Path2D()
        const p = new Path2D()


        configureContext(ctx, item, ()=>{
            drawTriangle(ctx, item)
        })


        ctx.beginPath();
        drawTriangle(ctx, item)
        ctx.stroke()


        drawTriangle(out, {
            x: item.x-30,
            y: item.y-30,
            w:item.w+60,
            h:item.h+40
        })
         drawTriangle(p, item)
        drawTriangle(inside, {
            x: item.x+30,
            y: item.y+30,
            w:item.w-60,
            h:item.h-50
        })

         setShapeInfo(dispatch, item, out, p , inside)


     }).bind(null, object), [object.center.x, object.center.y, object.angle, object.style,object.down])


    function drawTriangle(context, item) {
        context.moveTo(item.x + item.w / 2, item.y);
        context.lineTo(item.x, item.y + item.h);
        context.lineTo(item.x + item.w, item.y + item.h);
        context.lineTo(item.x + item.w / 2, item.y);
        if (!item.style?.line)
            context.lineTo(item.x, item.y + item.h);

    }

    const ref = useCanvas(draw)


    return (

        <canvas ref={ref}></canvas>
    )

}

export default Triangle