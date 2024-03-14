import React, {useState} from "react";
import css from "../../EditingPopUp/EditColors/EditingColors.module.css";
import {ColoredCircle} from "../../EditingPopUp/EditColors/helpers";
import BackgroundPopUp from "../../EditingPopUp/EditColors/BackgroundPopUp";
import {addStyle} from "../../../redux/curvesSlice"
import {MdOutlineTextIncrease, MdOutlineTimeline} from "react-icons/md";
import TypePopUp from "./TypePopUp";

const CurvePopUp = ({id}) => {

    const [selectedPopUp, setSelectedPopUp] = useState('')


    const handlePopUp = (name) => {
        if (selectedPopUp === name)
            setSelectedPopUp('')
        else {
            setSelectedPopUp(name)
        }
    }


    return (
        <div className={css.container}
             style={{top: '-5rem'}}
             onMouseDown={e => {
                 e.stopPropagation()
             }}>

            <div className={css.contentBox}>
                <div id={'color'} onClick={() => handlePopUp('color')}>
                    <ColoredCircle color={'white'}/>
                    {selectedPopUp === 'color' &&
                    <BackgroundPopUp id={id} category={'curves'} addStyle={addStyle}/>
                    }
                </div>
            </div>
            <div className={css.contentBox}>
                <div id={'type'} onClick={() => handlePopUp('type')}>
                    <MdOutlineTimeline/>
                    <span className={css.caption}>
                        Type
                    </span>
                    {selectedPopUp === 'type' &&
                    <div>
                        <TypePopUp id={id}/>
                    </div>
                    }
                </div>
            </div>
            <div className={`${css.contentBox} ${css.end}`}>
                <div id={'text'} onClick={() => handlePopUp('text')}>
                    <MdOutlineTextIncrease/>
                    {selectedPopUp === 'text' &&
                    <div></div>
                    }
                </div>
            </div>


        </div>
    )

}


export default CurvePopUp