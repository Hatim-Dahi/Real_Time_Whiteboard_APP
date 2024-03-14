import ColorPicker from "./ColorPicker";
import React, {useEffect, useState} from "react";
import {OpacityHandler, useDidMountEffect} from "./helpers";
import ContainerPopUp from "../ContainerPopUp";
import {selectStyles} from "../../../redux/shapesSlice";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import { PortalContainer } from "../../Layout/SideBarPopUps/ColorCircle";


const BackgroundPopUp = ({id, category='shapes', addStyle}) => {

    const dispatch = useAppDispatch()
    const style = useAppSelector((state)=>selectStyles(state,id, category))



    const [opacity, setOpacity] = useState(style?.opacity?style.opacity:1)


    useDidMountEffect(()=>{
        dispatch(addStyle({ id, style: {'opacity': opacity}}))
    }, [opacity])


    return (
        <PortalContainer>
            <ContainerPopUp colors={true}>
                <OpacityHandler id={id} value={opacity} setValue={setOpacity} name={"Opacity"}/>
                <ColorPicker id={id} name={'background'} category={category} addStyle={addStyle}/>
            </ContainerPopUp>
        </PortalContainer>
    )
}


export default BackgroundPopUp