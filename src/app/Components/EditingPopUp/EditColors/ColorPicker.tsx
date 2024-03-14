import css from "./EditingColors.module.css";
import {ChromePicker} from 'react-color'
import {createPortal} from 'react-dom';
import {ColoredCircle, OpacityHandler} from "./helpers";
import React, {useContext, useEffect, useRef, useState} from "react";
import {AiOutlinePlus} from "react-icons/ai";
import {discriminatedUnion} from "zod";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {selectStyles} from "../../../redux/shapesSlice";
import {PortalContext} from "../../Layout/SideBarPopUps/ColorCircle";


const ColorPicker = ({id, name, category = 'shapes', addStyle, ...props}) => {


    const dispatch = useAppDispatch()
    const containerRef = useContext(PortalContext);


    const colorPicker = useRef(null)
    const divRef = useRef(null)
    const [color, setColor] = useState({background: '#fff'})
    const [adding, setAdding] = useState(false)
    const [selected, setSelected] = useState(0)
    const [picker, setPicker] = useState(false)
    const [colors, setColors] = useState(['transparent', 'white', 'red', 'orange', 'black', 'green', 'yellow', 'blue'])
    const colorsState = useAppSelector(state => selectStyles(state, id, category)?.colors)


    useEffect(() => {
        if (colorsState)
            setColors(colorsState)
    }, [colorsState])


    useEffect(() => {
        function handleClickOutside(e) {
            if (colorPicker.current && !colorPicker.current.contains(e.target) && !divRef.current.contains(e.target)) {
                setPicker(false)

            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);

        };

    }, [colorPicker])

    const handleChangeComplete = (color) => {
        setColor(color.rgb)
        if (adding) return
        dispatch(addStyle({
            id,
            style: {
                [name]: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
            }
        }))
        dispatch(addStyle({
            id,
            style: {
                'colors': [...colors, `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`]
            }
        }))
        setAdding(true)
        setSelected(colors.length)
    };

    const handleChange = (color) => {
        setColor(color.rgb)
        if (adding) {
            // dispatch(addStyle({
            //     id,
            //     style: {
            //         'colors': [...colors.slice(0, colors.length - 1), `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`]
            //     }
            // }))
            dispatch(addStyle({
                id,
                style: {
                    [name]: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
                }
            }))
        }
    };

    function handleAdd(e) {
        e.stopPropagation()
        if (adding || picker) {
            setAdding(false)
            setPicker(false)
        } else {
            setPicker(true)
        }
    }

    function handleSelect(idx, el) {
        setSelected(idx)
        dispatch(addStyle({
            id,
            style: {
                [name]: el
            }
        }))
    }

    return (
        <>

            {props.children}


            <div className={css.colorBox}>
                {colors.map((el, id) => {
                    return <div key={id} onClick={() => handleSelect(id, el)}>
                        <ColoredCircle selected={id === selected} color={el}/>
                    </div>
                })}
                <span onClick={handleAdd} ref={divRef} style={{fontSize: '1.2rem', position: 'relative'}}>
                <AiOutlinePlus/>

                    {picker &&
                    createPortal(
                        <div
                            style={{userSelect: 'none'}}
                            className={css.colorPicker}
                            onKeyDown={(e) => {
                                e.stopPropagation()
                            }}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}>

                            <div ref={colorPicker}>

                                <ChromePicker color={color} onChange={handleChange}
                                              onChangeComplete={handleChangeComplete}/>
                            </div>


                        </div>, containerRef.current)

                    }
                </span>
            </div>


        </>
    )
}


export default ColorPicker