import ContainerPopUp from "../ContainerPopUp";
import React, {useEffect} from "react";
import css from './editText.module.css'
import {selectShape, updateEditor} from '../../../redux/shapesSlice'
import {convertFromRaw, convertToRaw, Editor, EditorState, RichUtils, SelectionState} from 'draft-js';
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";


const TextEditPopUp = ({id,close}) => {


    const dispatch = useAppDispatch()
    const state = (useAppSelector(state => selectShape(state,id)).editorState)
    // dispatch(updateEditor({id: id, editor: convertToRaw(newEditorState.getCurrentContent())}))




    function boldSelection() {
         const newEditorState = RichUtils.toggleInlineStyle(state, 'BOLD');
        dispatch(updateEditor({id: id, editor: convertToRaw(newEditorState.getCurrentContent())}))
        close()
    }

    function italicSelection() {
        const newEditorState = RichUtils.toggleInlineStyle(state, 'ITALIC');
        dispatch(updateEditor({id: id, editor: convertToRaw(newEditorState.getCurrentContent())}))
        close()
    }
    function underlineSelection() {
        const newEditorState = RichUtils.toggleInlineStyle(state, 'UNDERLINE');
        dispatch(updateEditor({id: id, editor: convertToRaw(newEditorState.getCurrentContent())}))
        close()
    }
    function strikeSelection() {
        const newEditorState = RichUtils.toggleInlineStyle(state, 'STRIKETHROUGH');
        dispatch(updateEditor({id: id, editor: convertToRaw(newEditorState.getCurrentContent())}))
        close()
    }




    return (

        <ContainerPopUp height={'2rem'}>
            <div className={css.textDecoration}>
                <b onClick={boldSelection}>B</b>
                <i onClick={italicSelection}>I</i>
                <u onClick={underlineSelection}>U</u>
                <s onClick={strikeSelection}>S</s>
            </div>
        </ContainerPopUp>
    )
}

export default TextEditPopUp