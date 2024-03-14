import css from './editText.module.css'
import {useEffect, useState} from "react";
import ContainerPopUp from "../ContainerPopUp";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {selectStyles} from "../../../redux/shapesSlice";
import {addStyle}  from '../../../redux/shapesSlice'

const SelectFont = ({id, show, setShow, category ="shapes", add = addStyle}) => {

    const dispatch = useAppDispatch()
    const style = useAppSelector((state)=>selectStyles(state,id, category))



    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(style?.fontFamily ? style.fontFamily:'Roboto Mono')
    const [fonts, setFonts] = useState([
        'Bebas Neue',
        'Josefin Sans',
        'Kanit',
        'Oswald',
        'Playfair Display',
        'Roboto',
        'Roboto Condensed',
        'Roboto Mono'])


    useEffect(()=>{
        if(show!=='text')
        setOpen(false)
    }, [show])


    function handleSelect(el) {
        setSelected(el)
        setOpen(false)
        dispatch(add({id, style: {fontFamily: `${el}`}}))

    }
    function handleOpen() {
        setShow('text')
        setOpen(!open)
    }


    return (

        <div className={css.container} onClick={handleOpen}>

            <div  className={css.selected} style={{fontFamily: `${selected}`}}>
                {selected}
            </div>

            {open &&
            <ContainerPopUp>
                {fonts.map(el => {
                    return <div key={el} className={css.option} onClick={()=>handleSelect(el)} style={{fontFamily: `${el}`}}>
                        {el}
                    </div>
                })}
            </ContainerPopUp>
            }
        </div>
    )
}

export default SelectFont