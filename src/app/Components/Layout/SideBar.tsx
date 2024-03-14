import {MdOutlineRectangle} from "react-icons/md";
import {BsPen} from "react-icons/bs";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import css from './layout.module.css'
import {HiArrowNarrowUp} from "react-icons/hi";
import {LuMousePointer2} from "react-icons/lu";
import ChoseShapePopUp from "./SideBarPopUps/ChoseShapePopUp";
import DrawingPopUp from "./SideBarPopUps/DrawingPopUp";
import CaptionOnHover from "./utils/CaptionOnHover";
import {updateDrawings, addDrawing} from "../../redux/drawingSlice";
import {updateCurves} from "../../redux/curvesSlice";
import {addText} from "../../redux/textSlice";
import {addCurve} from "../../redux/curvesSlice";
import {updateShapes, saveObjectInfo, addShape} from "../../redux/shapesSlice";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {BiText} from "react-icons/bi";
import {ActionCreators} from 'redux-undo';
import {TfiBackLeft, TfiBackRight} from "react-icons/tfi";
import {IoReturnDownBack, IoReturnUpForwardOutline} from "react-icons/io5";
import {Point} from "../../page";
import {moveCurve} from "../BezierCurves/useCurve";


const SideBar = ({setShape, setOption, option}) => {

    const dispatch = useAppDispatch()

    const [open, setOpen] = useState('')
    const popUps = useRef(null)
    const [toggle, setToggle] = useState(false)
    const [mousePosition, setMousePosition] = useState<Point>({x: 0, y: 0})
    const [caption, setCaption] = useState('')
    const drawings = useAppSelector(state => state.present.drawing.drawings)
    const curves = useAppSelector(state => state.present.curve.curves)
    const shapes = useAppSelector(state => state.present.shape.shapes)
    const savedObject = useAppSelector(state => state.present.shape.savedObject.saved)


    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [open, toggle, drawings, curves, shapes, mousePosition])


    useEffect(() => {
        function saveMousePosition(e) {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            })
        }

        window.addEventListener('mousemove', saveMousePosition)
        return () => {
            window.removeEventListener('mousemove', saveMousePosition)
        }
    }, [])

    function handleEnter(name) {
        setCaption(name)
    }

    function handleLeave() {
        setCaption('')
    }

    function handleCurveCopy(object) {
        const center = {
            x: object.borders.x + object.borders.w / 2,
            y: object.borders.y + object.borders.h / 2,
        }
        const d = {x: mousePosition.x - center.x, y: mousePosition.y - center.y}

        const {
            newCurve,
            path
        } = moveCurve(object, d)

        dispatch(addCurve({
            ...newCurve,
            curve: path
        }))

    }

    function handleKeyDown(e) {
        if (e.key.toUpperCase() === 'Z' && e.ctrlKey && e.shiftKey) {
            dispatch(ActionCreators.redo())
        } else if (e.key.toUpperCase() === 'Z' && e.ctrlKey) {
            dispatch(ActionCreators.undo())

        }

        if (e.key === "Backspace" || e.key === "Delete") {
            dispatch(updateDrawings(drawings.filter(el => !el.selected)))
            dispatch(updateCurves(curves.filter(el => !el.selected)))
            dispatch(updateShapes(shapes.filter(el => !el.selected)))
            setToggle(!toggle)

        }

        if (e.key.toUpperCase() === 'C' && e.ctrlKey) {
            dispatch(saveObjectInfo())
        }

        if (e.key.toUpperCase() === 'V' && e.ctrlKey) {
            if (!savedObject) return

            const temp = savedObject.object
            const object = {
                ...temp,
                x: mousePosition.x - temp.w / 2,
                y: mousePosition.y - temp.h / 2,
                copy: true
            }

            if (savedObject.type === 'shape') {
                dispatch(addShape(object))
            }
            if (savedObject.type === 'text') {
                dispatch(addText(object))
            }
            if (savedObject.type === 'drawing') {
                dispatch(addDrawing(object))
            }
            if (savedObject.type === 'curve') {
                handleCurveCopy(object)
            }
        }

        if (e.key.toUpperCase() === 'A' && e.altKey) {
            setOpen('')
            setOption("Selection")
            dispatch(updateDrawings(drawings.map(el => {
                return {...el, selected: true}
            })))
            dispatch(updateCurves(curves.map(el => {
                return {...el, selected: true}
            })))
            dispatch(updateShapes(shapes.map(el => {
                return {...el, selected: true}
            })))

            setToggle(!toggle)
        }

        if (e.key.toUpperCase() === 'V') {
            setOpen('')
            setOption("Selection")
        }
        if (e.key.toUpperCase() === 'T') {
            setOpen('')
            setOption("Text")
        }
        if (e.key.toUpperCase() === 'D') {
            if (open !== 'Drawing') {
                setOpen('Drawing')
            } else {
                setOpen('')
            }
            setOption("Drawing")
        }
        if (e.key.toUpperCase() === 'S') {
            if (open !== 'Shape') {
                setOpen('Shape')
            } else {
                setOpen('')
            }
            setOption("Shape")
        }
        if (e.key.toUpperCase() === 'C') {
            setOpen('')
            setOption("Curve")
        }

    }


    function handleOpenPopUp(name) {
        if (open === name) {
            setOpen('')
        } else {
            setOpen(name)
        }
    }

    return (
        <div
            onMouseDown={e => {
                e.preventDefault()
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation()
            }}
            onMouseUp={e => {

                if (popUps.current.contains(e.target)) return
                e.stopPropagation();
            }}
            className={css.sideBar}

        >
            <div className={'toolBar'} onKeyDown={handleKeyDown}>
                <div className={option === 'Selection' ? `${css.item} ${css.selectedTool}` : css.item}
                     onMouseEnter={() => handleEnter('Selection')}
                     onMouseLeave={handleLeave}
                     onClick={() => {
                         setOption('Selection')
                         setOpen('')
                     }}>
                    {caption === 'Selection' && open === '' &&
                    <CaptionOnHover text={'Select'} short={"V, alt + A"}/>
                    }
                    <LuMousePointer2/>
                </div>
                <div className={option === 'Drawing' ? `${css.item} ${css.selectedTool}` : css.item}
                     onMouseEnter={() => handleEnter('Drawing')}
                     onMouseLeave={handleLeave}
                     onClick={() => {
                         setOption('Drawing')
                         handleOpenPopUp('Drawing')
                     }}>
                    {caption === 'Drawing' && open === '' &&
                    <CaptionOnHover text={'Draw'} short={"D"}/>
                    }
                    <BsPen/>
                </div>
                <div className={option === 'Text' ? `${css.item} ${css.selectedTool}` : css.item}
                     onMouseEnter={() => handleEnter('Text')}
                     onMouseLeave={handleLeave}
                     onClick={() => {
                         setOption('Text')
                         handleOpenPopUp('Text')
                     }}>
                    {caption === 'Text' && open === '' &&
                    <CaptionOnHover text={'Text'} short={"T"}/>
                    }
                    <BiText/>
                </div>
                <div className={option === 'Shape' ? `${css.item} ${css.selectedTool}` : css.item}
                     onMouseEnter={() => handleEnter('Shape')}
                     onMouseLeave={handleLeave}
                     onClick={() => {
                         setOption("Shape")
                         handleOpenPopUp('Shape')
                     }}>
                    {caption === 'Shape' && open === '' &&
                    <CaptionOnHover text={'Shape'} short={"S"}/>
                    }
                    <MdOutlineRectangle/>
                </div>
                <div className={option === 'Curve' ? `${css.item} ${css.selectedTool}` : css.item}
                     onMouseEnter={() => handleEnter('Curve')}
                     onMouseLeave={handleLeave}
                     onClick={() => {
                         setOption('Curve')
                         setOpen('')
                     }}>
                    {caption === 'Curve' && open === '' &&
                    <CaptionOnHover text={'Connection Line'} short={"C"}/>
                    }
                    <HiArrowNarrowUp/>
                </div>


                <div>
                    {open === 'Shape' &&
                    <ChoseShapePopUp setShape={setShape} setOpen={() => handleOpenPopUp('Shape')}/>

                    }
                    {open === 'Drawing' &&
                    <DrawingPopUp cancelStopPropagationRef={popUps} close={() => handleOpenPopUp('Drawing')}/>

                    }

                </div>


            </div>

            <div className={css.bottomSection}>
                <div className={css.item}
                     onMouseEnter={() => handleEnter('Forward')}
                     onMouseLeave={handleLeave}
                     onClick={(e) => {
                         e.preventDefault()
                         setOption("Selection")
                         dispatch(ActionCreators.redo())
                         setOpen('')
                     }}>
                    {caption === 'Forward' && open === '' &&
                    <CaptionOnHover text={'Forward'} short={"Cntrl + Shift + Z"}/>
                    }
                    <IoReturnUpForwardOutline/>

                </div>
                <div className={css.item}
                     onMouseEnter={() => handleEnter('Back')}
                     onMouseLeave={handleLeave}
                     onClick={(e) => {
                         e.preventDefault()
                         setOption("Selection")
                         dispatch(ActionCreators.undo())
                         setOpen('')
                     }}>
                    {caption === 'Back' && open === '' &&
                    <CaptionOnHover text={'Back'} short={"Cntrl + Z"}/>
                    }
                    <IoReturnDownBack/>

                </div>

            </div>
        </div>
    )
}


export default SideBar