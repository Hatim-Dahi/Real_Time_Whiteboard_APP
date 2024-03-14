import {useEffect, useRef, useState} from "react";


export function useCanvas(draw) {

    const ref = useRef(null)
    useEffect(() => {


            const canvas = ref.current
            const ctx = canvas.getContext("2d")

            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            draw(ctx)



    }, [draw])

    return ref


}