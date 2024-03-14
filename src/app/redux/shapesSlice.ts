import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {EditorState} from 'draft-js';
import {removeDrawing} from './drawingSlice';
import {removeText} from './textSlice';

export interface shapeSlice {
    shapes: [object],
    paths: [object]
    savedObject: {
        last: object | null,
        saved: object | null
    }
}

const initialState: shapeSlice = {
    shapes: [],
    paths: [],
    savedObject: {
        last: null,
        saved: null
    }
}

export const shapeSlice = createSlice({
    name: 'shape',
    initialState,
    reducers: {
        addShape: (state, action) => {
            const id = state.shapes.length > 0 ? Math.max(...state.shapes.map(el => el.id)) + 1 : 1

            state.shapes.push({...action.payload, id: id,})
        },
        changeShape: (state, action) => {
            const indx = getId(state.shapes, action.payload.id)
            state.shapes[indx].shape = action.payload.shape

        },
        removeShape: (state, action) => {

            state.shapes = state.shapes.filter(el => el.id !== action.payload)
            state.paths = state.paths.filter(el => el.id !== action.payload)

        },
        updateShapes: (state, action) => {

            state.shapes = action.payload.map((el, id) => {
                return {...el, editor: state.shapes[id].editor}
            })

            // const ids = action.payload.map(el => el.id)
            // state.paths = state.paths.filter(el => ids.includes(el.id))
        },
        updateShape: (state, action) => {

            const indx = getId(state.shapes, action.payload.id)
            state.shapes[indx].x = action.payload.x
            state.shapes[indx].y = action.payload.y
            state.shapes[indx].w = action.payload.w
            state.shapes[indx].h = action.payload.h

        },
        addStyle: (state, action) => {
            const indx = getId(state.shapes, action.payload.id)
            state.shapes[indx].style = {
                ...state.shapes[indx].style,
                ...action.payload.style
            }
        },
        updateEditor: (state, action) => {
            const indx = getId(state.shapes, action.payload.id)
            state.shapes[indx].editor = action.payload.editor
            state.shapes[indx].editorState = action.payload.edState
        },
        setPath: (state, action) => {
            const pathId = getId(state.paths, action.payload.id)
            if (pathId !== -1) {
                state.paths[pathId] = {...action.payload}
            } else {
                state.paths.push(action.payload)
            }
        },
        setObjectInfo: (state, action) => {
            state.savedObject.last = action.payload
        },
        saveObjectInfo: (state) => {
            state.savedObject.saved = state.savedObject.last
        },
        addLink: (state, action) => {
            const id = getId(state.shapes, action.payload.id)
            if (id>=0) {
                state.shapes[id].link = action.payload.link
            }
        }


    },
    extraReducers: (builder => {
        builder
            .addCase(removeDrawing, (state, action) => {
                return {
                    ...state,
                    paths: state.paths.filter(el => el.id !== "d" + action.payload)
                }

            })
            .addCase(removeText, (state, action) => {
                return {
                    ...state,
                    paths: state.paths.filter(el => el.id !== "t" + action.payload)
                }

            })
    })
})


export const {
    addShape,
    removeShape,
    updateShapes,
    addStyle,
    updateEditor,
    changeShape,
    setPath,
    updateShape,
    setObjectInfo,
    saveObjectInfo,
    addLink
} = shapeSlice.actions

export function selectStyles(state, id, category = "shapes") {
    if (category === "drawing") return state.present[category]?.style
    if (category === "text") return state.present[category].texts.find(el => el.id === id)?.style
    const indx = state.present[category.slice(0, -1)][category].findIndex(el => el.id === id)
    return state.present[category.slice(0, -1)][category][indx]?.style
}

export function selectShape(state, id) {
    const indx = state.present.shape.shapes.findIndex(el => el.id === id)
    return state.present.shape.shapes[indx]
}

export function getId(collection, id) {
    return collection.findIndex(el => el.id === id)
}


export default shapeSlice.reducer