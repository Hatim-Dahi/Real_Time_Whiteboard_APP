import React, {useState} from "react";
import css from './EditColors/EditingColors.module.css'
import SelectFont from "./EditText/SelectFont";
import SelectSize from "./EditText/SelectSize";
import { addStyle } from "../../redux/textSlice";

const EditTextPopUp = ({id, style}) => {


    const [selectedPopUp, setSelectedPopUp] = useState('')




    return (
        <div className={css.container}
             style={{
                 top: '-3rem'
             }}
             onMouseDown={e => {
                 e.preventDefault()
             }}>
            <div className={css.contentBox}>
                <SelectFont id={id} setShow={setSelectedPopUp} show={selectedPopUp}  add={addStyle} category={"text"}/>
            </div>
            <div className={css.contentBox}>
                <SelectSize id={id} setShow={setSelectedPopUp} show={selectedPopUp} add={addStyle} category={"text"}/>
            </div>

        </div>
    )
}





export default EditTextPopUp