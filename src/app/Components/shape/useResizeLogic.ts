import {useEffect} from "react";


export function useResizeLogic(handleDown, handleUp, handleMove, down, toggle = true) {


    useEffect(() => {
        window.addEventListener('mousedown', handleDown)
        if (down) {
            window.addEventListener('mousemove', handleMove)
        }
        window.addEventListener('mouseup', handleUp)
        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mousedown', handleDown)
            window.removeEventListener('mouseup', handleUp)
        }
    }, [down, toggle])

}



