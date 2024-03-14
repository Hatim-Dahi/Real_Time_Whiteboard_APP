import React from "react";
import css from './curves.module.css'


const ControlPoint = ({point,ref,handleMouseDown, additional}) => {

    if(point?.delta){
        point = point.point
    }

    let style = {
        left: point.x - 5,
        top: point.y - 5
    }

    return (
        <>
            <span style={style}
                 ref={ref}
                 tabIndex={2}
                 className={additional?css.additionalCircle:css.editingCircle}
                 onMouseDown={handleMouseDown}
            />
        </>
    )
}

export default ControlPoint