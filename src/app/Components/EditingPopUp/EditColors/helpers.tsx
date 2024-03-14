import css from "./EditingColors.module.css";
import React, {useEffect, useRef, useState} from "react";
import {useResizeLogic} from "../../shape/useResizeLogic";
import {TbForbid2} from "react-icons/tb";
import {useAppDispatch} from "../../../redux/hooks";
import {addStyle} from '../../../redux/shapesSlice'

export const ColoredCircle = ({selected, color}) => {

    return (
        <div style={{position: 'relative', height: '30px'}}>
            {color === "transparent" ?
                <div className={css.transparentCircle}>
                    <TbForbid2/>
                </div> :
                <div className={css.coloredCircle} style={{'background': `${color}`}}/>
            }
            {selected &&
            <div className={css.selected}/>
            }

        </div>
    )
}


export const OpacityHandler = ({id, name, value, setValue}) => {


    const [down, setDown] = useState(false)
    const [drag, setDrag] = useState(false)
    const [toggle, setToggle] = useState(false)
    const [startX, setStartX] = useState(0)
    const [divs, setDivs] = useState([...Array(10).keys()])
    const start = useRef()

    useResizeLogic(handleDown, handleUp, handleMove, down, toggle)


    const style = {
        display: 'inline-block',
        width: '15px',
        height: '2px',
        background: 'grey',
        top: '1px',
        position: 'absolute'
    }
    const styleCircle = {
        position: 'absolute',
        display: 'inline-block',
        borderRight: '1px grey solid',
        width: '1px',
        height: '4px',
        background: 'transparent'
    }
    useEffect(() => {

        const handler = start.current

        const rect = handler.getBoundingClientRect()
        setStartX(rect.left + 5)


    }, [])


    function handleDown(e) {
        setDown(true)
    }

    function handleMove(e) {

        if (!down || !drag) return

        const position = e.clientX - startX
        const step = 16
        const clientPosition = Math.round(position / step) / 10

        if (clientPosition < 0 || clientPosition > 1) return;
        if (value === Math.round(position / step) / 10) return;


        setValue(Math.round(position / step) / 10)
        setToggle(!toggle)
    }

    function handleUp(e) {
        setDown(false)
        setDrag(false)
    }


    return (
        <div className={css.opacityContainer}>
            <div ref={start} className={css.opacityScroll}>
                {divs.map((el, id) => {
                    return <span
                        key={id}
                        style={{
                            ...style,
                            left: `${id * 10}px`,
                            background: `${value * 10 > id ? 'black' : 'grey'}`
                        }}
                        onClick={() => setValue(Math.round((id / 10 + 0.1) * 10) / 10)}
                    />
                })
                }
                {divs.map((el, id) => {
                    if (el === divs.length - 1) return
                    return <span
                        key={id}
                        style={{
                        ...styleCircle,
                        left: `${(id + 1) * 10}px`,
                        borderRight: `1px solid ${value * 10 > id ? 'black' : 'grey'}`
                    }}
                                 onClick={() => setValue(Math.round((id / 10 + 0.1) * 10) / 10)}
                    />
                })
                }
                <span
                    draggable={"false"}
                    onMouseOver={() => setDrag(true)}
                    style={{
                        ...styleCircle,
                        left: `${value * 100}px`,
                        borderRadius: '50%',
                        background: 'black',
                        width: '6px',
                        border: 'none',
                        height: '6px',
                        top: '-1px'
                    }}/>
            </div>
            <div className={css.opacityCaption}>
                <span draggable={"false"}>{name}</span>
                <span draggable={"false"}>{value * 100}%</span>
            </div>
        </div>


    )
}


export const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);

}