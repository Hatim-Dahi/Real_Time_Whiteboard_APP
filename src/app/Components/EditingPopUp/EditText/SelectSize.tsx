import css from './editText.module.css'
import React, {useEffect, useState} from "react";
import ContainerPopUp from "../ContainerPopUp";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {selectStyles} from "../../../redux/shapesSlice";
import {addStyle} from '../../../redux/shapesSlice'
import {HiOutlineArrowSmDown, HiOutlineArrowSmUp} from "react-icons/hi";
import {useDidMountEffect} from "../EditColors/helpers";

const SelectSize = ({id, show, setShow, category="shapes", add=addStyle}) => {

    const dispatch = useAppDispatch()
    const style = useAppSelector((state) => selectStyles(state, id, category))


    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(style?.fontSize ? style.fontSize : '18')
    const [fonts, setFonts] = useState([
        '10', '12', '14', '18', '24', '36', '48', '65', '80', '144'])


    useEffect(() => {
        if (show !== 'size')
            setOpen(false)
    }, [show])

    useDidMountEffect(() => {
        dispatch(add({id, style: {fontSize: `${selected}`}}))
    }, [selected])


    function handleSelect(el) {
        setSelected(el)
        setOpen(false)

    }

    function handleOpen() {
        setShow('size')
        setOpen(!open)
    }

    function handleUp() {
        const id = fonts.findIndex(el => el === selected)
        if (id < fonts.length - 1) {
            setSelected(fonts[id + 1])
        }
    }

    function handleDown() {
        const id = fonts.findIndex(el => el === selected)
        if (id > 0) {
            setSelected(fonts[id - 1])
        }
    }


    return (

        <div className={css.container} onClick={handleOpen}>

            <div style={{marginRight: '1rem', position: 'relative'}}>
                {selected}
                <span className={css.arrows} onClick={(e) => e.stopPropagation()}>
                    <div onClick={handleUp}>
                       <HiOutlineArrowSmUp/>
                    </div>
                    <div onClick={handleDown}>
                      <HiOutlineArrowSmDown/>
                    </div>
                </span>
            </div>

            {open &&
            <ContainerPopUp width={100}>
                {fonts.map(el => {
                    return <div key={el} className={css.option} onClick={() => handleSelect(el)}
                                style={{fontFamily: `${el}`}}>
                        {el}
                    </div>
                })}
            </ContainerPopUp>
            }
        </div>
    )
}

export default SelectSize