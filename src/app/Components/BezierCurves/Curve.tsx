import React, {useEffect, useRef, useState} from "react";
import {useCanvas} from "../shape/shapes/useCanvas";
import css from './curves.module.css'
import {useResizeLogic} from "../shape/useResizeLogic";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {removeCurve, updateBorders, setEditStatus} from "../../redux/curvesSlice";
import ControlPoint from "./ControlPoint";
import {useCurve} from "./useCurve";
import CurvePopUp from "./CurvePopUp/CurvePopUp";
import {selectStyles} from "../../redux/shapesSlice";
import RemoveObject from "../Layout/utils/RemoveObject";

const Curve = ({curve, isUsable, handleTop, handleBottom}) => {


    const [sample, setSample] = useState(curve)
    const [borders, setBorders] = useState({maxX: 0, maxY: 0, minX: 0, minY: 0})
    const container = useRef()
    const dispatch = useAppDispatch()
    const style = useAppSelector(state => selectStyles(state, curve.id, "curves"))


    useEffect(() => {
        setSample({...curve})
    }, [curve.points])


    const styleContainer = {
        left: `${borders.minX}px`,
        top: `${borders.minY}px`,
        width: `${Math.abs(borders.maxX - borders.minX)}px`,
        height: `${Math.abs(borders.maxY - borders.minY)}px`,
    }
    const selectedStyle = {
        left: -10,
        top: -10,
        display: 'block',
        width: `${borders.maxX - borders.minX + 20}px`,
        height: `${borders.maxY - borders.minY + 20}px`,
        position: "absolute",
        border: "1px solid blue",
    }


    function draw(curve, ctx, end = null) {
        if (style?.line) {
            if (style.line < 2) {

                ctx.setLineDash([5, 15]);
            } else {
                ctx.setLineDash([3, 3]);

            }
        }
        ctx.lineWidth = style?.thickness * 10
        ctx.strokeStyle = style?.background
        ctx.fillStyle = style?.background
        ctx.stroke(curve.curve);
        ctx.lineWidth = style?.thickness * 10 / 3 < 1 ? 1 : style?.thickness * 10 / 3

        drawArrow(ctx, curve.angle, end)
    }

    function drawArrow(ctx, angle, point = null) {
        const plist = getPoints(sample.points)
        const size = ctx.lineWidth * 10;
        ctx.beginPath();
        ctx.save();
        if (point === null) {
            ctx.translate(plist[plist.length - 1].x, plist[plist.length - 1].y);
        } else {
            ctx.translate(point.x, point.y);
        }
        ctx.rotate(angle);
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(-size, -size);
        ctx.lineTo(size / 2, 0);
        ctx.lineTo(-size, size);
        ctx.lineTo(-size / 2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function getBorders(plist) {
        let pointsList = getPoints(plist)
        let minX = pointsList[0].x
        let minY = pointsList[0].y
        let maxX = pointsList[0].x
        let maxY = pointsList[0].y
        pointsList.forEach(p => {
            if (p.x > maxX)
                maxX = p.x
            if (p.y > maxY)
                maxY = p.y
            if (p.x < minX)
                minX = p.x
            if (p.y < minY)
                minY = p.y
        })
        setBorders({maxX, maxY, minX, minY})
        return {
            x: minX - 10,
            y: minY - 10,
            w: Math.abs(maxX - minX) + 20,
            h: Math.abs(maxY - minY) + 20
        }

    }


    const ref = useCanvas(draw.bind(null, sample))
    const {
        additionalPoints,
        plist,
        getPoints,
        handleMove,
        handleUp,
        handleMouseDown,
        handleDown,
        editMode,
        toggle,
        down,
        isAttached,
        isAttachedBack
    } = useCurve(curve, ref, sample, setSample, draw, drawArrow, container, getBorders, isUsable,
        handleTop,
        handleBottom
    )

    // useEffect(() => {
    //     if (down) {
    //         handleBottom()
    //         dispatch(setEditStatus(true))
    //     } else {
    //         handleTop()
    //         dispatch(setEditStatus(false))
    //
    //     }
    // }, [down])

    useResizeLogic(() => {
    }, handleUp, handleMove, down, toggle)


    useEffect(() => {
        if (plist.length > 0) {
            getBorders(plist.concat(additionalPoints))
        }
    }, [plist])


    return (
        <>
            <RemoveObject removeFunc={removeCurve} id={curve.id}>
                <div ref={container} tabIndex={1} style={styleContainer}
                     className={css.container}
                     onMouseDown={handleMouseDown}

                >

                    {(editMode && !down) &&
                    <CurvePopUp id={curve.id}/>
                    }


                    {curve?.selected &&
                    <div style={selectedStyle}/>
                    }

                </div>


                {editMode &&
                <>
                    {plist.map((p, i) => {
                        return <ControlPoint key={i} handleMouseDown={() => handleDown(i, p)} point={p}/>
                    })}

                    {additionalPoints.map((p, i) => {
                        return <ControlPoint
                            key={'a' + i}
                            additional={true}
                            handleMouseDown={() => handleDown('a' + i)}
                            point={p}/>
                    })}

                </>
                }
                <canvas ref={ref}/>
            </RemoveObject>
        </>
    )
}

export default Curve