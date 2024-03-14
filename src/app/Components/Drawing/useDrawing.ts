import {addDrawing, selectDrawingStyle, updateDrawings} from "../../redux/drawingSlice";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {removeDrawing} from "../../redux/drawingSlice";
import {useState} from "react";
import {checkRectIntersection} from "../Selection/Selection";
import {setShapeInfo, setRectPath} from "../shape/shapes/Rectangle";


export const useDrawing = (brush, canvasRef, ctx, down, setDown) => {


    const dispatch = useAppDispatch()
    const [toggle, setToggle] = useState(false)
    const [path, setPath] = useState()
    const [pathArc, setPathArc] = useState()
    const [borders, setBorders] = useState({minX: 10000, maxX: 0, minY: 10000, maxY: 0})
    const [start, setStart] = useState({x: 0, y: 0})
    const drawingStyle = useAppSelector(state => selectDrawingStyle(state))
     const thickness = drawingStyle.thickness
    const color =  drawingStyle.color
    const drawings = useAppSelector(state => state.present.drawing.drawings)


    if (brush === "Pen") {
        const handleDown = (e) => {
            setDown(true)

            setStart({x: e.clientX, y: e.clientY})
            checkForBorders(e.clientX, e.clientY)
            setPath(new Path2D())
            setPathArc(new Path2D())
        }

        const handleUp = () => {
            if(ctx === undefined) return
            setDown(false)
            ctx.beginPath()
            dispatch(addDrawing({
                x: borders.minX,
                y: borders.minY,
                startX:borders.minX,
                startY: borders.minY,
                w: Math.abs(borders.maxX - borders.minX),
                h: Math.abs(borders.maxY - borders.minY),
                startW: Math.abs(borders.maxX - borders.minX),
                startH: Math.abs(borders.maxY - borders.minY),
                stroke: path,
                fill: pathArc,
                color: color,
                thickness: thickness
            }))
            const canvas = canvasRef.current
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setBorders({minX: 10000, maxX: 0, minY: 10000, maxY: 0})
            setToggle(!toggle)
        }

        const handleMove = (e) => {
            if (!down) return

            if (getDistance(start, {x: e.clientX, y: e.clientY}) < 6) return;
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            ctx.lineWidth = getLineWidth(thickness)
            ctx.strokeStyle = color
            ctx.lineCap = "round";


            path.moveTo(start.x, start.y)
            path.lineTo(e.clientX, e.clientY)
            ctx.stroke(path)
            setStart({x: e.clientX, y: e.clientY})
            checkForBorders(e.clientX, e.clientY)
            setToggle(!toggle)
        }
        return {
            handleUp,
            handleDown,
            handleMove,
            down,
            toggle,
            getLineWidth,
            draw
        }
    }
    if (brush === "Eraser") {
        const handleDown = (e) => {
            setDown(true)
         }

        const handleUp = () => {
            setDown(false)

        }

        const handleMove = (e) => {
            if (!down) return
             const selection = {
                x: e.clientX,
                y: e.clientY,
                w: 2,
                h: 2
            }
             drawings.forEach((rect, id) => {
                if(checkRectIntersection(selection, rect)){
                    dispatch(removeDrawing(rect.id))
                }
            })


        }
        return {
            handleUp,
            handleDown,
            handleMove,
            down,
            toggle,
            getLineWidth,
            draw,
            drawings
        }
    }

    function checkForBorders(x, y) {

        const temp = {...borders}

        if (borders.minX > x) {
            temp.minX = x
        }
        if (borders.maxX < x) {
            temp.maxX = x
        }
        if (borders.minY > y) {
            temp.minY = y
        }
        if (borders.maxY < y) {
            temp.maxY = y
        }

        setBorders(temp)

    }



    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2))
    }


}

function getLineWidth(thickness) {
    if (thickness === 0) return 2

    return 2 + 10 * thickness
}
export function draw(drawing, ctx, dispatch) {

    ctx.strokeStyle = drawing.color
    ctx.lineCap = "round";
    ctx.lineWidth = getLineWidth(drawing.thickness)


    ctx.resetTransform()

    const sclaeX = drawing.w / drawing.startW
    const sclaeY = drawing.h / drawing.startH

    const c = drawing.center
    ctx.translate(c.x, c.y)
    ctx.rotate(drawing.angle * Math.PI / 180);
    ctx.translate(-c.x, -c.y)


    ctx.translate(drawing.x - drawing.startX * sclaeX, drawing.y - drawing.startY * sclaeY)
    ctx.transform(sclaeX, 0, 0, sclaeY, 0, 0)
    ctx.stroke(drawing.stroke)

    setRectPath(dispatch, drawing, "d"+drawing.id)



    ctx.resetTransform()
    ctx.beginPath()

}