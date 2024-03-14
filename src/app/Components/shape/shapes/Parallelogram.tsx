import {useCallback, useEffect, useRef} from "react";
import {useCanvas} from "./useCanvas";
import {useAppDispatch} from "../../../redux/hooks";
import {configureContext, setShapeInfo, useGetItemStyle} from "./Rectangle";


const Parallelogram = ({item}) => {
    const dispatch = useAppDispatch()
    const object = useGetItemStyle(item)


    const draw = useCallback(((item, ctx) => {

        const out = new Path2D()
        const inside = new Path2D()
        const p = new Path2D()


        configureContext(ctx, item, () => {
            drawParallelogram(ctx, item)

        })

        ctx.beginPath();
        drawParallelogram(ctx, item)
        ctx.stroke()

        drawParallelogram(out, {
            x: item.x - 15,
            y: item.y - 15,
            w: item.w + 30,
            h: item.h + 30
        })
        drawParallelogram(p, item)
        drawParallelogram(inside, {
            x: item.x + 15,
            y: item.y + 15,
            w: item.w - 30,
            h: item.h - 30
        })
        setShapeInfo(dispatch, item, out, p , inside)



    }).bind(null, object), [object.center.x, object.center.y, object.angle, object.style, object.down])

    function drawParallelogram(context, item) {
        context.moveTo(item.x + item.w / 5, item.y);
        context.lineTo(item.x, item.y + item.h);
        context.lineTo(item.x + item.w / 5 * 4, item.y + item.h);
        context.lineTo(item.x + item.w, item.y);
        context.lineTo(item.x + item.w / 5, item.y);
        if (!item.style?.line)
            context.lineTo(item.x, item.y + item.h);

    }


    const ref = useCanvas(draw)


    return (

        <canvas ref={ref}></canvas>
    )

}

export default Parallelogram