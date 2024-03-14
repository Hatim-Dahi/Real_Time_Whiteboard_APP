import {createContext, useEffect, useRef, useState} from "react";
import css from "../layout.module.css";
import * as React from "react";
import ContainerPopUp from "../../EditingPopUp/ContainerPopUp";
import {OpacityHandler} from "../../EditingPopUp/EditColors/helpers";
import ColorPicker from "../../EditingPopUp/EditColors/ColorPicker";
import {addStyle} from "../../../redux/drawingSlice"
import {useAppDispatch} from "../../../redux/hooks";


const ColorCircle = ({id, open, color, isSelected, setOpen}) => {


    const dispatch = useAppDispatch()

    const [thickness, setThickness] = useState(color.thickness)


    useEffect(() => {
         if(isSelected===id && thickness!==undefined)
        dispatch(addStyle({
            id,
            style: {
                color: color.color,
                thickness: thickness
            }
        }))

    }, [isSelected, thickness])


    const style = {
        width: `calc(1.3rem*${thickness})`,
        height: `calc(1.3rem*${thickness})`,
        background: `${color.color}`,
        margin: `calc(50% - 1.3rem*${thickness}/2) auto 0`,
    }


    return (
        <>

            <div className={css.colorBorder} onClick={() => setOpen(id)}
                 style={{outline: `${isSelected === id ? '1px solid blue' : ''}`}}>
                <div className={css.colorCircle} style={style}/>
                {id === open && open === isSelected &&
                <div className={css.alinedPopUp}>
                    <ColorPopUp id={id} thickness={thickness} setThickness={setThickness}/>
                </div>
                }

            </div>

        </>
    )
}


const ColorPopUp = ({id, thickness, setThickness}) => {

    const container = useRef()
    return (

        <PortalContainer>
            <ContainerPopUp width={'10rem'} height={'12rem'} colors={false}>
                <OpacityHandler id={id} value={thickness} setValue={setThickness} name={"Thickness"}/>
                <ColorPicker containerRef={container} id={id} name={'color'} category={'drawing'}
                             addStyle={addStyle}/>
            </ContainerPopUp>
        </PortalContainer>


    )
}

export const PortalContext = createContext(false);

export const PortalContainer = (props) => {
    const container = useRef()

    return (
        <div ref={container} className={css.colorPickerPortal}>
            <PortalContext.Provider value={container}>
                {props.children}
            </PortalContext.Provider>
        </div>
    )


}


export default ColorCircle