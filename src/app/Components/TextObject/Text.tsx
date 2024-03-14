import {useAppDispatch} from "../../redux/hooks";
import {removeText, updateTextObject} from "../../redux/textSlice";
import RemoveObject from "../Layout/utils/RemoveObject";
import ContainerResizeComponent, {ObjectContext} from "../DndResizeRotateContainer/ContainerResizeComponent";
import MyEditor from "./MyEditor";
import {useContext, useEffect} from "react";
import EditTextPopUp from "../EditingPopUp/EditTextPopUp";
import * as React from "react";
import {setRectPath, setShapeInfo} from "../shape/shapes/Rectangle";

const Text = ({text}) => {


    const dispatch = useAppDispatch()


    function saveChanges(object) {
        dispatch(updateTextObject(object))
    }




    return (
        <RemoveObject key={text.id} removeFunc={removeText} id={text.id}>
            <ContainerResizeComponent id={text.id}
                                      editorObject={text}
                                      saveChanges={saveChanges}
                                      renderProp={(object) => <UpdateTextPath object={object}/>}
            >

                <PopUp text={text}/>
                <MyEditor id={text.id} category={'object'}/>
            </ContainerResizeComponent>
        </RemoveObject>
    )
}

const UpdateTextPath = ({object})=>{
    const dispatch = useAppDispatch()
    useEffect(()=>{
        setRectPath(dispatch, object, "t"+object.id)
    }, [object.center.x, object.center.y, object.angle, object.style, object.down])

}

const PopUp = ({text}) => {
    const obj = useContext(ObjectContext)

    return (
        <>
            {obj?.editMode && !obj?.down &&
            <EditTextPopUp id={text.id}/>
            }
        </>
    )
}

export default Text