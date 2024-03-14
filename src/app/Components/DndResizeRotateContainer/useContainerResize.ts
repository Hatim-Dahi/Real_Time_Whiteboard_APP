import {useContext, useEffect, useMemo, useState} from "react";
import {LevelContext} from "../../page";


export const useContainerResize = (editorObject, isUsable, child, container, saveChanges) => {

    const level = useContext(LevelContext)

    const [start, setStart] = useState({x: 0, y: 0})
    const [center, setCenter] = useState({
        x: editorObject.x + editorObject.w / 2,
        y: editorObject.y + editorObject.h / 2
    })
    const [down, setDown] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [direction, setDirection] = useState('')
    const [object, setObject] = useState({
        ...editorObject,
        angle: 0,
    })
    const [toggle, setToggle] = useState(true)
    const leftEdge = useMemo(() => object.w + object.x, [down, toggle])
    const edge = useMemo(() => object.x, [down, direction])
    const topEdge = useMemo(() => object.h + object.y, [direction])

    const TextStyle = {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        left: object.x - 10,
        top: object.y - 10,
        width: object.w,
        height: (object.shape === "Circle" ? object.w : object.h),
        padding: "10px",
        outline: editMode ? "2px solid lightblue" : "none",
        transform: `rotate(${object?.angle}deg)`,
        transition: 'background .2s ease-out'
    }
    const overlayStyle = {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        left: -30,
        top: -30,
        width: object.w + 60,
        height: (object.shape === "Circle" ? object.w : object.h) + 60,
        padding: "10px",

    }


    useEffect(() => {
        setObject({...editorObject, angle: object.angle})
    }, [editorObject.x, editorObject.y, editorObject.w, editorObject.h, editorObject?.shape])


    useEffect(() => {
        setCenter(
            {x: object.x + object.w / 2, y: object.y + object.h / 2}
        )
    }, [object.x, object.y, object.w, object.h])


    useEffect(() => {
        function handleClickOutside(e) {
            if (container.current && !container.current.contains(e.target)) {
                setEditMode(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [container])


    function handleMouseDown(e) {

        if (e.target !== child.current && !child.current.contains(e.target) && e.button === 0) {
            setStart({x: e.clientX, y: e.clientY})
            setDown(true)
        }
        if (isUsable === "Selection")
            setEditMode(true)
    }

    function handleMouseMove(e) {
        if (object.angle % 360 !== 0 && !(direction === "rotate" || direction === "")) return;
        if (!down || isUsable !== "Selection") return

        if (direction !== "") {
            if (direction !== "rotate")
                setToggle(!toggle)
            setObject(prev => {

                switch (direction) {
                    case "bottom":
                        if (e.clientY <= object.y) {
                            setDirection("top")
                            return {
                                ...object,
                                y: e.clientY,
                                h: 2
                            }
                        }
                        return {
                            ...object,
                            h: e.clientY - object.y
                        }
                    case "top":
                        if (e.clientY >= topEdge) {
                            setDirection("bottom")
                            setToggle(!toggle)
                            return {
                                ...object,
                                y: object.h + object.y,
                                h: 2
                            }
                        }
                        return {
                            ...object,
                            y: e.clientY,
                            h: topEdge - e.clientY,
                        }
                    case "left":
                        if (e.clientX >= leftEdge) {
                            setDirection("right")
                            setToggle(!toggle)
                            return {
                                ...object,
                                w: 2,
                                x: e.clientX,
                            }
                        }
                        return {
                            ...object,
                            x: e.clientX,
                            w: leftEdge - e.clientX,
                        }
                    case "right":
                        if (object.x + object.w <= edge) {
                            setDirection("left")
                            setToggle(!toggle)
                            return {
                                ...object,
                                w: 2,
                                x: e.clientX,
                            }

                        }
                        return {
                            ...object,
                            w: e.clientX - object.x,
                        }
                    case "rt":
                        if (e.clientY >= topEdge || object.x + object.w <= edge) {
                            return handleReverseRt(e, object)
                        }
                        return {
                            ...object,
                            w: e.clientX - object.x,
                            y: e.clientY,
                            h: topEdge - e.clientY,
                        }
                    case "lt":
                        if (e.clientY >= object.h + object.y || e.clientX >= leftEdge) {

                            return handleReverseLt(e, object)
                        }
                        return {
                            ...object,
                            y: e.clientY,
                            x: e.clientX,
                            w: leftEdge - e.clientX,
                            h: topEdge - e.clientY,
                        }
                    case "br":
                        if (e.clientY <= object.y || e.clientX <= object.x) {
                            return handleReverseBr(e, object)
                        }
                        return {

                            ...object,
                            w: e.clientX - object.x,
                            h: e.clientY - object.y

                        }
                    case "bl":
                        if (e.clientY <= object.y || e.clientX >= leftEdge) {
                            return handleReverseBl(e, object)
                        }
                        return {
                            ...object,
                            w: e.clientX >= leftEdge ? object.w : object.w - e.clientX + object.x,
                            x: e.clientX >= leftEdge ? leftEdge - 2 : e.clientX,
                            h: e.clientY - object.y
                        }
                    case "rotate":
                        const center = {x: object.x + object.w / 2, y: object.y + object.h / 2}
                        const v1 = {x: start.x - center.x, y: start.y - center.y}
                        const v2 = {x: e.clientX - center.x, y: e.clientY - center.y}

                        const firstAngle = Math.atan2(v1.y, v1.x);
                        const secondAngle = Math.atan2(v2.y, v2.x);
                        const a = secondAngle - firstAngle;
                        const newAngle = a * 180 / Math.PI;
                        if (Math.abs((object.angle + newAngle) % 45) < 10) {
                            return {
                                ...object,
                                angle: object.angle + newAngle - (object.angle + newAngle) % 45
                            }
                        } else {
                            return {
                                ...object,
                                angle: object.angle + newAngle
                            }
                        }
                }
                return prev

            })
        } else {

            const d = {x: e.clientX - start.x, y: e.clientY - start.y}
            setObject({
                ...object,
                x: editorObject.x + d.x,
                y: editorObject.y + d.y,
            })
            setToggle(!toggle)
        }

    }

    function handleReverseRt(e, el) {
        if (e.clientY >= topEdge) {
            setDirection("br")
            setToggle(!toggle)
            return {
                ...el,
                y: el.h + el.y,
                h: 2
            }
        } else {
            setDirection("lt")
            setToggle(!toggle)
            return {
                ...el,
                w: 2,
                x: e.clientX,
            }
        }
    }

    function handleReverseLt(e, el) {
        if (e.clientY >= el.h + el.y) {
            setDirection("bl")
            setToggle(!toggle)
            return {
                ...el,
                y: el.h + el.y,
                h: 2
            }
        } else {
            setDirection("rt")
            setToggle(!toggle)
            return {
                ...el,
                w: 2,
                x: e.clientX,
            }

        }
    }

    function handleReverseBr(e, el) {
        if (e.clientY <= el.y) {
            setDirection("rt")
            setToggle(!toggle)
            return {
                ...el,
                y: e.clientY,
                h: 2
            }
        } else {
            setDirection("bl")
            setToggle(!toggle)
            return {
                ...el,
                w: 2,
                x: e.clientX,
            }

        }
    }

    function handleReverseBl(e, el) {
        if (e.clientY <= el.y) {
            setDirection("lt")
            setToggle(!toggle)
            return {
                ...el,
                y: e.clientY + 10,
                h: 2
            }
        } else {
            setDirection("br")
            setToggle(!toggle)
            return {
                ...el,
                w: el.x - e.clientX,
                x: leftEdge,
            }

        }
    }

    function handleMouseUp(e) {
        if (!down) return
        setDown(false)
        setToggle(!toggle)
        setDirection('')
        if (object) {
            saveChanges(object)
        }
    }

    const handleClearDir = () => {
        if (down) return
        setToggle(!toggle)
        setDirection('')
    }

    const handleMouseOver = (str) => {
        if (!down)
            setDirection(str)
    }

    function addCurve(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {

        const style = getComputedStyle(e.target)
        const rect = e.target.getBoundingClientRect()
        let x = rect.x + rect.width / 2
        let y = rect.y + rect.height / 2


        if (style.top === "-30px")
            y += 35
        if (style.bottom === "-30px")
            y -= 35
        if (style.right === "-30px")
            x -= 35
        if (style.left === "-30px")
            x += 35


        setEditMode(false)
        level?.setOption("Curve")
        level?.setStart({x, y})
        if (editorObject?.stroke) {
            level?.setShapeId("d" + editorObject.id)
        } else if (editorObject?.shape) {
            level?.setShapeId(editorObject.id)
        } else {
            level?.setShapeId("t" + editorObject.id)

        }


    }


    return {
        handleClearDir,
        handleMouseOver,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        addCurve,
        toggle,
        object,
        center,
        editMode,
        down,
        TextStyle,
        overlayStyle
    }


}