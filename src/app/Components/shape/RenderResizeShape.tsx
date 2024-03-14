import ContainerResizeComponent from "../DndResizeRotateContainer/ContainerResizeComponent";
import {renderSwitch} from "./renderShape";
import MyEditor from "../TextObject/MyEditor";
import {useAppDispatch} from "../../redux/hooks";
import {removeShape, updateShape} from "../../redux/shapesSlice"
import EditingPopUp from "../EditingPopUp/EditingPopUp";
import * as React from "react";
import RemoveObject from "../Layout/utils/RemoveObject";


const RenderResizeShape = ({item}) => {

    const dispatch = useAppDispatch()


    function saveChanges(shape) {
        dispatch(updateShape(shape))
    }


    return (<>
            <RemoveObject key={item.id} removeFunc={removeShape} id={item.id}>
                <ContainerResizeComponent
                    id={item.id}
                    editorObject={item}
                    renderProp={(object) => <Object obj={object}/>}
                    saveChanges={saveChanges}
                >
                    <MyEditor editable={true} id={item.id}/>
                </ContainerResizeComponent>

            </RemoveObject>

        </>
    )
}


const Object = ({obj}) => {
    const isEditable = obj?.editMode && !obj?.down


    const PopUpStyle = {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        left: obj.x - 10,
        top: obj.y - 40,
        width: obj.w,
        height: 60,
        padding: "10px",
        zIndex: "10",
        transform: " translateY(-140%)"
    }

    return (
        <>
            {isEditable &&
            <div style={PopUpStyle}>
                <EditingPopUp id={obj.id}/>
            </div>
            }
            <div>
                {renderSwitch(obj)}
            </div>
        </>
    )
}


export default RenderResizeShape