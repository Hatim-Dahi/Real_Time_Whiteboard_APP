import {useDroppable} from "@dnd-kit/core";
import * as React from "react";

function Droppable(props) {

    const style = {
        width: "100vw",
        height: "100vh",
        position: "relative",

    };


    return (
        <div style={style}>
            {props.children}
        </div>
    );
}


export default Droppable