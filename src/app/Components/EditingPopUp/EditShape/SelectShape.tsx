import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {selectShape, changeShape} from "../../../redux/shapesSlice";
import {MdOutlineRectangle} from "react-icons/md";
import {CgShapeRhombus} from "react-icons/cg";
import {BiRectangle} from "react-icons/bi";
import {IoEllipseOutline} from "react-icons/io5";
import {BsTriangle} from "react-icons/bs";
import * as React from "react";
import ContainerPopUp from "../ContainerPopUp";
import css from "./EditingShapes.module.css";


const SelectShape = ({id}) => {

    const dispatch = useAppDispatch()
    const shapeState = useAppSelector((state) => selectShape(state, id))
    const [open, setOpen] = useState(false)
    const [shape, setShape] = useState(shapeState?.shape)
    const dict = {
        "Rectangle": <MdOutlineRectangle/>,
        "Rhombus": <CgShapeRhombus/>,
        "Parallelogram":
            <div className={'skewX'}>
                <BiRectangle/>
            </div>,
        "Ellipse": <div className={css.scale}>
            <div className={'skew'}>
                <IoEllipseOutline/>
            </div>
        </div>,
        "Circle": <IoEllipseOutline/>,
        "Triangle": <BsTriangle/>,
        "RoundRect": <BiRectangle/>,

    }

    function handleChange(shape) {
        setShape(shape)
        dispatch(changeShape({id: id, shape: shape}))
        setOpen(false)
    }


    return (
        <>
            <div onClick={() => setOpen(!open)}>

                <div style={{width:'30px'}}></div>
                <div className={css.main}>
                    {dict[shape]}
                </div>
            </div>

            {open &&
            <ContainerPopUp height={'10rem'} colors={true}>
                <div className={css.flexContainer}>

                    {Object.entries(dict).map(([key, value]) => {
                        return <span key={key} onClick={() => handleChange(key)}>
                            {value}
                        </span>
                    })}

                </div>

            </ContainerPopUp>
            }
        </>

    )
}


export default SelectShape