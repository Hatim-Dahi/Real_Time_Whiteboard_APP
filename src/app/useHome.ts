import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {useState} from "react";
import {addShape, removeShape} from "./redux/shapesSlice";
import {convertToRaw, EditorState} from "draft-js";


export const useHome = () => {


    const dispatch = useAppDispatch()


    const [shape, setShape] = useState('')
    const [option, setOption] = useState('')



    const shapes = useAppSelector(state => state.present.shape.shapes)


    function handleRemoveShape(e, id) {
        if (e.key === "Backspace" || e.key === "Delete") {
            dispatch(removeShape(id))
        }

    }

    function handleAddShape(e) {
        if (shape === '') return
        dispatch(addShape({
            shape: shape,
            x: e.clientX as number,
            y: e.clientY as number,
            w: 160,
            h: 80,
            style:{},
            editor: convertToRaw(EditorState.createEmpty().getCurrentContent())
        }))
        setShape('')
        setOption('Selection')
    }




    return{
        option,
        setOption,
        setShape,
        handleRemoveShape,
        handleAddShape,
        shapes,
     }
}