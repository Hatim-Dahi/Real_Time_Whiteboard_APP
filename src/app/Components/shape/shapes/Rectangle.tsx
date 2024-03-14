import {useCallback, useContext, useEffect, useRef} from "react";
import {useCanvas} from "./useCanvas";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {selectShape, setPath} from "../../../redux/shapesSlice";


const Rectangle = ({item}) => {

    const dispatch = useAppDispatch()
    const object = useGetItemStyle(item)

    const draw = useCallback(((item, ctx) => {
        const out = new Path2D()
        const inside = new Path2D()
        const p = new Path2D()


        configureContext(ctx, item, () => {
            ctx.rect(item.x, item.y, item.w, item.h)
        })


        ctx.beginPath()
        ctx.strokeRect(item.x, item.y, item.w, item.h)

        out.rect(item.x - 15, item.y - 15, item.w + 30, item.h + 30)
        p.rect(item.x, item.y, item.w, item.h)
        inside.rect(item.x + 15, item.y + 15, item.w - 30, item.h - 30)

        setShapeInfo(dispatch, item, out, p, inside)


    }).bind(null, object), [object.center.x, object.center.y, object.angle, object.style, object.down])

    const ref = useCanvas(draw)


    return (

        <canvas style={{position: "absolute", inset: 0}} ref={ref}></canvas>
    )

}

export function useGetItemStyle(item) {
    const style = useAppSelector(state => selectShape(state, item.id))?.style
    return {...item, style}
}

export function setShapeInfo(dispatch, item, out, p, inside) {

    dispatch(setPath({
        id: item.id,
        shape: item.shape,
        o: out,
        i: inside,
        p: p,
        center: {x: item.x + item.w / 2, y: item.y + (item.shape === "Circle" ? item.w : item.h) / 2},
        w: item.w,
        h: item.h,
        angle: item.angle
    }))
}

export function setRectPath(dispatch, item, id) {
    const out = new Path2D()
    const inside = new Path2D()
    const p = new Path2D()
    out.rect(item.x - 25, item.y - 25, item.w + 38, item.h + 38)
    p.rect(item.x -10, item.y-10, item.w +28, item.h+28)
    inside.rect(item.x, item.y, item.w, item.h)
    setShapeInfo(dispatch, {...item, id: id}, out, p, inside)
}

export function configureContext(ctx, item, func) {

    ctx.translate(item.center.x, item.center.y)
    ctx.rotate(item.angle * Math.PI / 180);
    ctx.translate(-item.center.x, -item.center.y)

    if (item.style?.opacity >= 0) {
        ctx.globalAlpha = item.style.opacity
    }
    if (item.style?.background) {
        ctx.fillStyle = item.style.background;
        func()
        ctx.fill()
    }

    ctx.globalAlpha = item.style?.borderOpacity >= 0 ? item.style?.borderOpacity : 1
    ctx.strokeStyle = item.style?.borderColor ? item.style?.borderColor : 'black'
    let dashedStepLength = 5
    if (item.style?.borderThickness) {
        ctx.lineWidth = 25 * item.style?.borderThickness
        dashedStepLength = 5 * ctx.lineWidth
    }

    if (item.style?.line) {
        if (item.style.line < 2) {
            ctx.setLineDash([dashedStepLength, 15]);
        } else {
            ctx.setLineDash([dashedStepLength / 5, 3]);
        }
    }
}


export default Rectangle