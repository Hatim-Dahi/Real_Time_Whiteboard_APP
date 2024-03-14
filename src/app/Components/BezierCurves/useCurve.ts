import {useEffect, useRef, useState} from "react";
import {getPointOnCurve} from "./CurvesCanvas";
import {updateCurve, setEditStatus} from "../../redux/curvesSlice";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {is} from "immer/dist/utils/common";
import {selectStyles} from "../../redux/shapesSlice";
import {RootState} from "../../redux/store";
import {patchConsoleError} from "next/dist/client/components/react-dev-overlay/internal/helpers/hydration-error-info";
import {patchIncorrectLockfile} from "next/dist/lib/patch-incorrect-lockfile";


export function useCurve(curve, ref, sample, setSample, draw, drawArrow, container, getBorders, isUsable, handleTop, handleBottom) {

    const paths = useAppSelector((state) => state.present.shape.paths)
    const style = useAppSelector(state => selectStyles(state, curve.id, "curves"))


    const dispatch = useAppDispatch()
    const [additionalPoints, setAddPoints] = useState([])
    const [plist, setPoints] = useState([])
    const [ControlPoint, setControlPoint] = useState(curve.copy ? '' : '1')
    const [editMode, setEditMode] = useState(false)
    // const [editMode, setEditMode] = useState(true)
    const [isAttached, setIsAttached] = useState(false)
    const [isAttachedBack, setIsAttachedBack] = useState(false)
    const [curveTransform, setCurveTransform] = useState(false)
    const [down, setDown] = useState(curve.copy ? false : true)
    const [editPoint, setEditPoint] = useState(1)
    const [replacePoint, setReplace] = useState({x: 0, y: 0})
    const [removeCount, setRemoveCount] = useState(0)
    const [update, setUpdate] = useState(false)
    const [pathIndex, setPathIndex] = useState(-1)
    const [objectSnapshot, setObjectSnapshot] = useState(null)
    const [pathIndexBack, setPathIndexBack] = useState(curve.shapeIndex)
    const [objectSnapshotBack, setObjectSnapshotBack] = useState(null)
    const [shapeStartPath, shapeEndPath] = useAppSelector(selectShapes)
    const refVersion = useRef(true)
    const counter = useRef(0)
    const counterBack = useRef(0)


    useEffect(() => {
        if (shapeEndPath && down) {
            dispatch(setEditStatus(true))
        }
    }, [])


    useEffect(() => {
        followShapes(objectSnapshot, shapeStartPath, true, followShapes(objectSnapshotBack, shapeEndPath, false))
        setObjectSnapshot(shapeStartPath)
        setObjectSnapshotBack(shapeEndPath)
    }, [shapeStartPath, shapeEndPath])


    useEffect(() => {

        if (shapeEndPath?.shape) {
            if (shapeEndPath) {
                shapeChangeHandle(shapeEndPath, sample.points[0])
            }
            if (shapeStartPath) {
                shapeChangeHandle(shapeStartPath, sample.points[sample.points.length - 1], false)

            }
        }

        //divide that
    }, [shapeEndPath?.shape, shapeStartPath?.shape])


    function shapeChangeHandle(path, point, back = true) {
        const ctx = getContext(ref)
        const isPointOnTheLine = ctx.isPointInStroke(path.p, point.x, point.y);
        const isPointNearPathLeft = ctx.isPointInPath(path.p, point.x + path.w / 2, point.y);
        const isPointNearPathRight = ctx.isPointInPath(path.p, point.x - path.w / 2, point.y);
        if (!isPointOnTheLine) {
            if (isPointNearPathLeft || isPointNearPathRight) {
                let side = null
                for (let i = 1; side === null; i++) {
                    if (ctx.isPointInStroke(path.p, point.x + i, point.y)) {
                        side = true
                    }
                    if (ctx.isPointInStroke(path.p, point.x - i, point.y)) {
                        side = false
                    }
                    if (side !== null) {
                        const temp = back ?
                            [{x: point.x + (side ? i : -i), y: point.y}, ...sample.points.slice(1)] :
                            [...sample.points.slice(0, sample.points.length - 1), {
                                x: point.x + (side ? i : -i),
                                y: point.y
                            }]
                        const {cur, endingAngle} = drawHightOrderCurve(temp, ctx)
                        setSample({
                            ...sample,
                            points: temp,
                            curve: cur,
                            angle: endingAngle,
                        })
                        setUpdate(!update)
                    }

                }
            }
        }
        refVersion.current = false

    }


    function followShapes(snapshot, currentPath, isForward, points?) {


        if (snapshot !== null && snapshot !== undefined && currentPath !== undefined) {
            const isMoved = snapshot.center.x !== currentPath.center.x || snapshot.center.y !== currentPath.center.y
            const isScaled = snapshot.w !== currentPath.w || snapshot.h !== currentPath.h
            const isRotated = snapshot.angle !== currentPath.angle

            let temp = points === undefined ? [...sample.points] : points
            const p = (isForward ? temp[temp.length - 1] : temp[0])
            let point

            if (isRotated) {
                const deltaAngle = -(snapshot.angle - currentPath.angle) * (Math.PI / 180)

                point = {
                    x: (p.x - currentPath.center.x) * Math.cos(deltaAngle) - (p.y - currentPath.center.y) * Math.sin(deltaAngle) + currentPath.center.x,
                    y: (p.y - currentPath.center.y) * Math.cos(deltaAngle) + (p.x - currentPath.center.x) * Math.sin(deltaAngle) + currentPath.center.y
                }
            } else if (isScaled) {
                const ratioX = snapshot.w / currentPath.w !== 0 ? snapshot.w / currentPath.w : 1
                const ratioY = snapshot.h / currentPath.h !== 0 ? snapshot.h / currentPath.h : 1

                let scaledDeltaX = (snapshot.center.x - p.x) / ratioX
                let scaledDeltaY = (snapshot.center.y - p.y) / ratioY

                point = {
                    x: currentPath.center.x - scaledDeltaX,
                    y: currentPath.center.y - scaledDeltaY
                }
            } else if (isMoved) {
                const deltaX = snapshot.center.x - currentPath.center.x
                const deltaY = snapshot.center.y - currentPath.center.y

                point = {x: p.x - deltaX, y: p.y - deltaY}
            }

            if (point !== undefined) {
                const result = [point, getAdditionalPoint(point, currentPath.center)]
                temp.splice(isForward ? temp.length - 2 : 0, temp.length === 2 ? 1 : 2, ...(isForward ? result.reverse() : result))

                const ctx = getContext(ref)
                const {cur, endingAngle} = drawHightOrderCurve(temp, ctx)
                setSample({
                    ...sample,
                    points: temp,
                    curve: cur,
                    angle: endingAngle,
                })
                return temp
            }

        }

    }


    function selectShapes(state) {
        return [
            state.present.shape.paths.find(el => el.id === pathIndex),
            state.present.shape.paths.find(el => el.id === pathIndexBack),
        ]
    }


    function calculatePoints() {
        const addPoints = []
        const points = []
        const samplePoints = [...sample.points]
        let progress = 0

        const step = 1 / ((samplePoints.length - 1) * 2)


        //test
        samplePoints.forEach((p, i) => {

            points.push(bezier(progress, getPoints(samplePoints)))
            progress += step

            if (i !== samplePoints.length - 1) {
                addPoints.push(bezier(progress, getPoints(samplePoints)))
                progress += step
            }
        })

        return {
            addPoints,
            points
        }
    }


    useEffect(() => {
        if (sample.points.length > 2) {
            const {addPoints, points} = calculatePoints()
            setAddPoints(addPoints)
            setPoints(points)
            setUpdate(!update)
        } else {
            setPoints(sample.points)
            const start = sample.points[0]
            const end = sample.points[sample.points.length - 1]
            const {cp1, cp2} = getDefaultBezierControlPoints(start, end)
            setAddPoints([getPointOnCurve(start, cp1, cp2, end, 0.5)])
            setUpdate(!update)
        }
    }, [sample])


    useEffect(() => {
        function handleClickOutside(e) {
            if (container.current && !container.current.contains(e.target) &&
                e.target.nodeName !== "SPAN") {
                setEditMode(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [container])

    function handleMouseDown(e) {
        if (isUsable !== "Selection") return;
        if (ref.current.getContext("2d").isPointInPath(curve.curve, e.clientX, e.clientY)) {
            if (editMode) {
                setDown(true)
                setReplace({x: e.clientX, y: e.clientY})
                return
            }
            setEditMode(true)
            setReplace({x: e.clientX, y: e.clientY})


        } else {
            setEditMode(false)
        }
        setDown(true)
    }


    function handleUp(e) {
        if (!down) return

        dispatch(updateCurve({
            ...sample,
            borders: getBorders(plist.concat(additionalPoints))
        }))
        setDown(false)
        setControlPoint('')
        setReplace({x: e.clientX, y: e.clientY})
        setUpdate(!update)
        setEditPoint(null)
        setCurveTransform(false)
        handleTop()
        dispatch(setEditStatus(false))


    }

    function getContext(ref) {
        const canvas = ref.current
        const ctx = canvas.getContext("2d")
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return ctx
    }

    const isSimpleDragging = ControlPoint === '' && editMode
    const isRecreatingCubicBezier = sample.points.length === 2 && ControlPoint[0] !== 'a'
    const isUpdatingHightOrderBezier = editPoint !== null


    function handleMove(e) {
        if (!down) return;
        e.preventDefault()
        if (isSimpleDragging) {

            if (isAttached || isAttachedBack) return;
            const ctx = getContext(ref)

            const d = {x: e.clientX - replacePoint.x, y: e.clientY - replacePoint.y}

            const {
                newCurve,
                points,
                end,
                path
            } = moveCurve(curve, d)

            setSample({
                ...newCurve, curve: path, points: points,
            })
            setUpdate(!update)
            draw({...newCurve, curve: path}, ctx, end)
            return;

        }
        if (isRecreatingCubicBezier) {
            updateCubicBezier(e)
            return;
        }
        if (isUpdatingHightOrderBezier) {
            let deleteCount
            let cPointId
            let del
            let newIndx
            let temp = [...sample.points]


            if (ControlPoint[0] === 'a') {
                cPointId = ControlPoint.substring(1) * 1
                deleteCount = sample.points.length === curve.points.length ? 0 : 1
                newIndx = cPointId + 1

            } else {
                cPointId = ControlPoint * 1
                deleteCount = 1
                newIndx = (cPointId > temp.length - 1 ? temp.length - 1 : cPointId)
            }
            del = {x: 0, y: 0}

            if (temp[newIndx]?.delta) {
                del = temp[newIndx]?.delta
            }


            let nPoint: any
            const ctx = getContext(ref)


            if ((cPointId === 0 && ControlPoint[0] !== 'a') || cPointId == sample.points.length - 1) {
                nPoint = {x: e.clientX, y: e.clientY}
                nPoint = magnetAlignment(ctx, e, nPoint, cPointId)
            } else {
                nPoint = {x: e.clientX + del.x, y: e.clientY + del.y}
            }


            const newPoint = {
                point: nPoint,
                delta: del

            }

            if (style?.background) {
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
            }


            const {cur, endingAngle} = drawHightOrderCurve(temp, ctx)

            setSample(prev => {

                const temp = [...prev.points]


                if (Array.isArray(nPoint)) {
                    if (cPointId !== 0) {
                        temp.splice(temp.length - 1, 1, nPoint[nPoint.length - 1])
                        setIsAttached(true)
                    }
                    if (cPointId === 0) {
                        temp.splice(cPointId, 1, nPoint[nPoint.length - 1])
                        setIsAttachedBack(true)
                    }
                } else {
                    if (cPointId >= temp.length - 1) {
                        setIsAttached(false)
                        setRemoveCount(0)
                        setPathIndex(-1)
                        counter.current = 0
                    }
                    if (cPointId === 0) {
                        setIsAttachedBack(false)
                        setRemoveCount(0)
                        setPathIndexBack(-1)
                        counterBack.current = 0
                    }

                    let newOne = (curve.points.length === sample.points.length) ? 0 : 1


                    newPoint.delta = {
                        x: newPoint.delta.x - (plist[(cPointId + newOne > plist.length - 1 ? plist.length - 1 : cPointId + newOne)].x - e.clientX) / 3,
                        y: newPoint.delta.y - (plist[(cPointId + newOne > plist.length - 1 ? plist.length - 1 : cPointId + newOne)].y - e.clientY) / 3
                    }


                    if (newOne === 1) {
                        if (isAttached) {
                            temp.splice(newIndx - 1, deleteCount + removeCount + 1, newPoint)
                        } else if (isAttachedBack) {
                            temp.splice(0, deleteCount + removeCount + 1, newPoint)
                        } else {
                            temp.splice(newIndx, deleteCount + removeCount, newPoint)
                        }

                    } else {

                        if (isAttached && cPointId >= temp.length - 1) {
                            temp.splice(newIndx - 1, deleteCount + 1, newPoint)

                        } else if (isAttachedBack) {
                            temp.splice(0, deleteCount + 1, newPoint)

                        } else {

                            temp.splice(newIndx, deleteCount, newPoint)
                        }

                    }

                    if (cPointId > sample.points.length - 1)
                        setControlPoint(cPointId - 1)


                }


                if ((isAttached || isAttachedBack) && nPoint[0]) {

                    if (cPointId === 0) {
                        if (counterBack.current == 0) {
                            temp.splice(1, 0, nPoint[0])
                        } else {
                            temp.splice(1, 1, nPoint[0])
                        }
                        counterBack.current++
                    } else {
                        if (counter.current == 0) {
                            temp.splice(temp.length - 1, 0, nPoint[0])
                            setControlPoint(prev => `${prev + 1}`)
                        } else {
                            temp.splice(temp.length - 2, 1, nPoint[0])
                        }
                        counter.current++
                    }


                }

                if (temp.length < 3) return prev
                return {
                    ...prev,
                    points: temp,
                    curve: cur,
                    angle: endingAngle,
                }
            })
            setUpdate(!update)
            return;
        }
    }

    function drawHightOrderCurve(points, ctx) {

        const cur = new Path2D()

        const tStart = bezier(0.98, getPoints(points))
        const dx = getPoints(points)[points.length - 1].x - tStart.x;
        const dy = getPoints(points)[points.length - 1].y - tStart.y;
        const endingAngle = Math.atan2(dy, dx);


        makeHightOrderCurvePath(cur, getPoints(points), ctx)
        ctx.stroke(cur)
        ctx.lineWidth = style?.thickness * 10 / 3 < 1 ? 1 : style?.thickness * 10 / 3
        drawArrow(ctx, endingAngle)
        return {
            cur,
            endingAngle
        }

    }

    function magnetAlignment(ctx, e, nPoint, cPointId) {
        for (let i = 0; i < paths.length; i++) {
            const p = paths[i]
            const isPointInside = ctx.isPointInPath(p.i, e.clientX, e.clientY);
            const isPointNearLine = ctx.isPointInPath(p.o, e.clientX, e.clientY);
            if (isPointInside) {
                setPathIds(cPointId, p.id)
                const last = curve.points[curve.points.length - 1]?.point ? curve.points[curve.points.length - 1]?.point :
                    curve.points[curve.points.length - 1]
                const diff = {x: p.center.x - last.x, y: p.center.y - last.y}
                let n = 1
                if (Math.abs(diff.y) > Math.abs(diff.x)) {
                    if (diff.y > 0) {
                        while (ctx.isPointInPath(p.i, p.center.x, p.center.y - n)) {
                            n++
                        }
                        return [getAdditionalPoint({
                            x: p.center.x,
                            y: p.center.y - n - 10
                        }, p.center), {x: p.center.x, y: p.center.y - n - 10}]
                    } else {
                        while (ctx.isPointInPath(p.i, p.center.x, p.center.y + n)) {
                            n++
                        }
                        return [getAdditionalPoint({
                            x: p.center.x,
                            y: p.center.y + n + 10
                        }, p.center), {x: p.center.x, y: p.center.y + n + 10}]
                    }
                } else {
                    if (diff.x > 0) {
                        while (ctx.isPointInPath(p.i, p.center.x - n, p.center.y)) {
                            n++
                        }
                        return [getAdditionalPoint({
                            x: p.center.x - n - 10,
                            y: p.center.y
                        }, p.center), {x: p.center.x - n - 10, y: p.center.y}]
                    } else {
                        while (ctx.isPointInPath(p.i, p.center.x + n, p.center.y)) {
                            n++
                        }
                        return [getAdditionalPoint({
                            x: p.center.x + n + 10,
                            y: p.center.y
                        }, p.center), {x: p.center.x + n + 10, y: p.center.y}]
                    }
                }
            } else if (isPointNearLine) {
                setPathIds(cPointId, p.id)
                let posX = e.clientX
                let posY = e.clientY
                for (let i = 1; i < 15; i++) {
                    if (ctx.isPointInStroke(p.p, posX + i, posY)) {
                        return [getAdditionalPoint({x: posX + i, y: posY}, p.center), {x: posX + i, y: posY}]

                    }
                    if (ctx.isPointInStroke(p.p, posX - i, posY)) {
                        return [getAdditionalPoint({x: posX - i, y: posY}, p.center), {x: posX - i, y: posY}]

                    }
                    if (ctx.isPointInStroke(p.p, posX, posY + i)) {
                        return [getAdditionalPoint({x: posX, y: posY + i}, p.center), {x: posX, y: posY + i}]

                    }
                    if (ctx.isPointInStroke(p.p, posX, posY - i)) {
                        return [getAdditionalPoint({x: posX, y: posY - i}, p.center), {x: posX, y: posY - i}]

                    }
                }
            }


        }

        return nPoint

    }


    function setPathIds(pointId, id) {
        // console.log(id)
        if (pointId === 0) {
            setPathIndexBack(id)
        } else {
            setPathIndex(id)
        }
    }

    function getAdditionalPoint(point, center) {
        let d = {x: point.x - center.x, y: point.y - center.y}
        if (Math.abs(d.y) > 180) {
            d.y = d.y > 0 ? 180 : -180
        }
        if (Math.abs(d.x) > 180) {
            d.x = d.x > 0 ? 180 : -180
        }
        if (Math.abs(d.y) < 50) {
            d.y = d.y > 0 ? d.y + 50 : d.y - 50
        }
        if (Math.abs(d.x) > 50) {
            d.x = d.x > 0 ? d.x + 50 : d.x - 50
        }
        return {x: point.x + d.x, y: point.y + d.y}

    }

    function updateCubicBezier(e) {
        const ctx = getContext(ref)


        let nPoint
        nPoint = magnetAlignment(ctx, e, nPoint, ControlPoint * 1)

        if (nPoint === undefined) {
            // update curve based on mouse position
            const path = new Path2D();
            const newCurve = {...sample}
            let newArr = [...newCurve.points]
            newArr[ControlPoint] = {x: e.clientX, y: e.clientY}
            newCurve.points = newArr
            path.moveTo(newCurve.points[0].x, newCurve.points[0].y);
            const start = newCurve.points[0]
            const end = newCurve.points[newCurve.points.length - 1]
            let {cp1, cp2} = makeCurve(start, end, path)
            const tStart = getPointOnCurve(start, cp1, cp2, end, 0.95)
            const dx = end.x - tStart.x;
            const dy = end.y - tStart.y;
            const endingAngle = Math.atan2(dy, dx);
            draw({...newCurve, curve: path, angle: endingAngle}, ctx, end)
            if (!refVersion.current && shapeEndPath !== undefined) {
                const p = sample.points[0]
                const isPointOnTheLine = ctx.isPointInStroke(shapeEndPath.p, p.x, p.y);
                if (isPointOnTheLine) refVersion.current = true
            }
            console.log(refVersion.current)
            if (refVersion.current || shapeEndPath === undefined) {
                setSample({
                    ...newCurve,
                    curve: path,
                    angle: endingAngle,
                    points: [newCurve.points[0], newCurve.points[newCurve.points.length - 1]],
                })
            }
            setUpdate(!update)

        } else {
            setCurveTransform(true)
            let temp = [...sample.points]
            const newIndx = ControlPoint * 1
            if (newIndx === 0)
                nPoint.reverse()

            temp.splice(newIndx, 1, ...nPoint)
            if (newIndx !== 0)
                setControlPoint(temp.length - 1)

            const delta = {x: temp[1].x - temp[0].x, y: temp[1].y - temp[0].y}


            temp.splice(1, 1, {x: temp[0].x + delta.x / 3, y: temp[0].y + delta.y / 3})


            const cur = new Path2D()
            const tStart = bezier(0.98, getPoints(temp))
            const dx = getPoints(temp)[temp.length - 1].x - tStart.x;
            const dy = getPoints(temp)[temp.length - 1].y - tStart.y;
            const endingAngle = Math.atan2(dy, dx);
            makeHightOrderCurvePath(cur, getPoints(temp), ctx)
            drawArrow(ctx, endingAngle, temp[temp.length - 1])
            ctx.stroke(cur)
            setSample({
                ...sample, points: temp, curve: cur, angle: endingAngle,
            })
            setUpdate(!update)
        }

    }


    function handleDown(string, p = null) {
        handleBottom()
        dispatch(setEditStatus(true))
        setDown(true)
        setControlPoint(string)
        let cPointId
        let cPoint
        if (string[0] === 'a') {
            cPointId = string.substring(1) * 1
            cPoint = additionalPoints[cPointId]

        } else {
            cPointId = string * 1
            if (sample.points)
                cPoint = sample.points[cPointId]

        }
        if (p !== null && plist.length > 2) {
            setEditPoint({
                point: cPoint,
                curveP: p
            })
        } else {
            setEditPoint(cPoint)
        }
    }


    return {
        additionalPoints,
        plist,
        getPoints,
        handleMove,
        handleUp,
        handleMouseDown,
        handleDown,
        editMode,
        toggle: update,
        down,
        isAttached,
        isAttachedBack
    }
}

function getDefaultBezierControlPoints(start, end) {
    let cp1 = {x: (end.x - start.x) / 5 + start.x, y: ((end.y - start.y) / 5) * 4 + start.y};
    let cp2 = {x: ((end.x - start.x) / 5) * 4 + start.x, y: (end.y - start.y) / 5 + start.y};
    return {cp1, cp2}
}

function getPoints(data) {
    if (data.length <= 2) return data
    return data.map(el => {
        return el?.point ? el.point : el
    })
}

function makeCurve(start, end, path) {
    const {cp1, cp2} = getDefaultBezierControlPoints(start, end)
    path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    return {cp1, cp2}
}


function binom(n, k) {
    let coeff = 1;
    for (let i = n - k + 1; i <= n; i++) coeff *= i;
    for (let i = 1; i <= k; i++) coeff /= i;
    return coeff;
}

function bezier(t, plist) {
    var order = plist.length - 1;

    var y = 0;
    var x = 0;

    for (let i = 0; i <= order; i++) {
        x = x + (binom(order, i) * Math.pow((1 - t), (order - i)) * Math.pow(t, i) * (plist[i].x));
        y = y + (binom(order, i) * Math.pow((1 - t), (order - i)) * Math.pow(t, i) * (plist[i].y));
    }

    return {
        x: x,
        y: y
    };
}

function makeHightOrderCurvePath(path, points) {

    let accuracy = 0.01;
    for (let i = 0; i < 1; i += accuracy) {
        let p = bezier(i, points);
        path.lineTo(p.x, p.y);
    }
    const last = points[points.length - 1]
    path.lineTo(last.x, last.y)

}

export const moveCurve = (curve, d) => {

    const path = new Path2D();
    const newCurve = {
        ...curve,
        points: curve.points.map(p => {
            if (p?.point) {
                return {
                    ...p,
                    point: {x: p.point.x + d.x, y: p.point.y + d.y}
                }
            } else {
                return {x: p.x + d.x, y: p.y + d.y}
            }

        }),
    }
    let end
    let points
    if (newCurve.points.length < 3) {
        path.moveTo(newCurve.points[0].x, newCurve.points[0].y);
        const start = newCurve.points[0]
        end = newCurve.points[newCurve.points.length - 1]
        points = [start, end]
        makeCurve(start, end, path)
    } else {
        points = getPoints(newCurve.points)
        end = points[points.length - 1]
        makeHightOrderCurvePath(path, points)
    }

    return {
        newCurve,
        points,
        end,
        path
    }
}
