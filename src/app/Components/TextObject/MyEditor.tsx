import React, {useRef, useEffect, useContext, useState, useCallback} from 'react';
import Draft, {convertFromRaw, convertToRaw, Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateEditor} from '../../redux/shapesSlice'
import {selectTextEditor, updateTextEditor} from "../../redux/textSlice";
import {ObjectContext} from "../DndResizeRotateContainer/ContainerResizeComponent";


function MyEditor({id, style, focus, editable, category = 'shape'}) {
    const editor = useRef()
    const dispatch = useAppDispatch()
    const object = useContext(ObjectContext);

    const element = useAppSelector(state => selectTextEditor(state, id, category))
    const state = element ? EditorState.createWithContent(convertFromRaw(element.editor)) : EditorState.createEmpty()
    const shapeStyle =  element?.style
    const [edState, setEdState] = useState(state)


    const styles = {
        root: {
            fontFamily: shapeStyle?.fontFamily ? shapeStyle?.fontFamily : '\'Helvetica\', sans-serif',
            overflow: 'auto',
            height: '40%',
            maxHeight: object?.h ? object.h : '200px',
            width: object?.w ? object.w : category === "shape" ? '60%' : '100%',
        },
        editor: {
            cursor: 'text',
            background: 'transparent',
            padding: 10,
            fontSize: shapeStyle?.fontSize ? shapeStyle.fontSize + 'px' : '14px',
            userSelect: object?.down ? 'none' : 'auto',


        },
        button: {
            marginTop: 10,
            textAlign: 'center',
        },
    };


    useEffect(() => {
        handleFocus()
    }, [focus])


    function updateState(editorState) {
        setEdState(editorState)
        if (category === 'shape') {
            dispatch(updateEditor({
                id: id,
                edState: editorState,
                editor: convertToRaw(editorState.getCurrentContent())
            }))
        } else {
            dispatch(updateTextEditor({id: id, editor: convertToRaw(editorState.getCurrentContent())}))
        }
    }


    function handleFocus() {
        if (!editor.current) return
        if (focus) {
            editor.current.focus()
        } else {
            editor.current.blur()
        }

    }

    return (
        <div style={{...styles.root, ...style}}
             data-no-dnd={true} onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === "Backspace") {
                e.stopPropagation()
            }
        }}
        >

            <div style={{...styles.editor}}>
                <div>
                    <Editor textAlignment={"center"} ref={editor}

                            editorState={EditorState.acceptSelection(state, edState.getSelection())}
                            placeholder={"Type something"}
                            onChange={updateState}/>

                </div>
            </div>
        </div>
    )
}


export default MyEditor