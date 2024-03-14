import css from "../layout.module.css";
import ContainerPopUp from "../../EditingPopUp/ContainerPopUp";
import * as React from "react";
import {IoMdClose} from "react-icons/io";
import {BsEraser, BsPen} from "react-icons/bs";
import ColorCircle from "./ColorCircle";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {setBrush} from "../../../redux/drawingSlice";


const DrawingPopUp = ({cancelStopPropagationRef, setShape, close}) => {


    const dispatch = useAppDispatch()


    const [index, setIndex] = useState(0)
    const [selected, setSelected] = useState(1)
    const [selectedBrush, setSelectedBrush] = useState('Pen')
    const colors = useAppSelector(state => state.present.drawing.style.selected)


    useEffect(() => {
        dispatch(setBrush(selectedBrush))
    }, [selectedBrush])


    function handlePopUp(id) {
        if (index === id) {
            setIndex(0)
        } else {
            if (selected === id)
                setIndex(id)
        }
        setSelected(id)
    }


    return (
        <div className={css.popUpPosition} style={{top: '-3rem'}}>
            <ContainerPopUp height={'16rem'} width={'2.2rem'} colors={true}>
                <div className={css.popUp} style={{paddingLeft: '0rem', width: '100%'}}>
                    <div className={css.option} onClick={close}>
                        <IoMdClose/>
                        <div className={css.horizontalDivider}/>

                    </div>
                    <div className={`${css.option} ${selectedBrush === "Pen" && css.selected}`}
                         onClick={() => {
                             setSelectedBrush("Pen")
                         }}
                    >
                        <BsPen/>
                    </div>
                    <div className={`${css.option} ${selectedBrush === "Eraser" && css.selected}`}
                         style={{marginTop: '-.2rem'}}
                         onClick={() => setSelectedBrush("Eraser")}
                    >
                        <BsEraser/>
                        <div className={css.horizontalDivider}/>
                    </div>
                    <div ref={cancelStopPropagationRef}>
                        {colors.map((color, id) => {
                            return <ColorCircle key={id} id={id + 1} open={index} color={color} isSelected={selected}
                                                setOpen={handlePopUp}/>
                        })}

                    </div>


                </div>
            </ContainerPopUp>
        </div>
    )
}

export default DrawingPopUp