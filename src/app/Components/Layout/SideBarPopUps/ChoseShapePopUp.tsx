import css from "../layout.module.css";
import ContainerPopUp from "../../EditingPopUp/ContainerPopUp";
import Icon from "../utils/Icon";
import * as React from "react";


const ChoseShapePopUp = ({setShape, setOpen}) => {


    return (
        <div className={css.popUpPosition}>
             <ContainerPopUp  height={'8rem'} width={'8rem'}  colors={true}>
                <div className={css.popUp}>
                    <div className={css.item} onClick={() => {
                        setShape("Rectangle")
                        setOpen(false)
                    }}>
                        <Icon icon={'rectangle.png'}/>
                    </div>
                    <div className={css.item} onClick={() => {
                        setShape("Rhombus")
                        setOpen(false)
                    }}>
                        <Icon st={{width: '20px', height: '20px'}} icon={'rhomb.png'}/>
                    </div>
                    <div className={css.item} onClick={() => {
                        setShape("Parallelogram")
                        setOpen(false)
                    }}>
                        <Icon st={{width: '30px', height: '30px'}} icon={'parallelogram.png'}/>
                    </div>
                    <div className={css.item} onClick={() => {
                        setShape("Ellipse")
                        setOpen(false)
                    }}>


                        <Icon icon={'ellipse.png'}/>

                    </div>
                    <div className={css.item} onClick={() => {
                        setShape("Circle")
                        setOpen(false)
                    }}>
                        <Icon icon={'circle.png'}/>
                    </div>
                    <div className={css.item} onClick={() => {
                        setShape("Triangle")
                        setOpen(false)
                    }}>
                        <Icon icon={'triangle.png'}/>
                    </div>
                    <div className={css.item} onClick={() => {
                        setShape("RoundRect")
                        setOpen(false)
                    }}>
                        <Icon icon={'roundRectangle.png'}/>
                    </div>
                </div>
            </ContainerPopUp>
        </div>
    )
}

export default ChoseShapePopUp