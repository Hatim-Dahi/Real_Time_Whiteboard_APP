import * as React from "react";
import {useAppDispatch} from "../../../redux/hooks";

 const RemoveObject = ({removeFunc, id, children}: {
    removeFunc: Function,
    id: number | string
    children: React.ReactNode
}) => {

     const dispatch = useAppDispatch()

     function handleRemove(e) {
         if (e.key === "Backspace" || e.key === "Delete") {
             dispatch(removeFunc(id))
         }

     }
     
     
    return (
        <div tabIndex={1} onKeyDown={handleRemove}>
            {children}
        </div>
    )
}

export default RemoveObject