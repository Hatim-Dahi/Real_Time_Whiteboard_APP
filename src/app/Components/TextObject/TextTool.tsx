import {useContext, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {convertToRaw, EditorState} from "draft-js";
import {addText} from "../../redux/textSlice";
import * as React from "react";


const TextTool = ({isUsed, setOption}) => {

    const dispatch = useAppDispatch()


    useEffect(() => {

        window.addEventListener('mousedown', handleDown)
        return () => {
            window.removeEventListener('mousedown', handleDown)
        }
    }, [isUsed])

    function handleDown(e) {
        if (!isUsed) return

        dispatch(addText({
                x: e.clientX - 50,
                y: e.clientY - 10,
                h: 50,
                w: 200,
                style: {},
                editor: convertToRaw(EditorState.createEmpty().getCurrentContent())
            }
        ))
        setOption('Selection')
    }


    return (
        <></>
    )

}



export default TextTool