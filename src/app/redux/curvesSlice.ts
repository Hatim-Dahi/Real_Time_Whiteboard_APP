import {createSlice} from '@reduxjs/toolkit'
import {getId} from "./shapesSlice";


export const curveSlice = createSlice({
    name: 'curve',
    initialState: {
        curves: [],
        status: false
    },
    reducers: {
        addCurve: (state, action) => {
            const id = state.curves.length > 0 ? Math.max(...state.curves.map(el => el.id)) + 1 : 1
            state.curves.push({...action.payload, id: id, style: {}})

        },
        removeCurve: (state, action) => {

            state.curves = state.curves.filter(el => el.id !== action.payload)
        },
        updateCurve: (state, action) => {
            const curve = action.payload
            let idx
            state.curves.forEach((el, id) => {
                if (el.id === curve.id) {
                    idx = id
                }
            })
            if (idx !== -1) {
                state.curves[idx].curve = curve.curve
                state.curves[idx].angle = curve.angle
                state.curves[idx].points = curve.points
                state.curves[idx].borders = curve.borders

            }
        },
        updateCurves: (state, action) => {
            state.curves = [...action.payload]
        },
        setEditStatus: (state, action) => {
            state.status = action.payload
        },
        addStyle: (state, action) => {
            const indx = getId(state.curves, action.payload.id)
            state.curves[indx].style = {
                ...state.curves[indx].style,
                ...action.payload.style
            }
        },


    },
})


export const {addCurve, removeCurve, updateCurve, addStyle, updateBorders, updateCurves, setEditStatus} = curveSlice.actions

export function maybeSelectSth(state, id) {

}


export default curveSlice.reducer