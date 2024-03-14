import Rectangle from "./shapes/Rectangle";
import Rhombus from "./shapes/rhombus";
import Circle from "./shapes/Circle";
import Ellipse from "./shapes/Ellipse";
import Parallelogram from "./shapes/Parallelogram";
import Triangle from "./shapes/Triangle";
import RoundRectangle from "./shapes/RoundRectangle";
import * as React from "react";

export const renderSwitch = (item) => {
    switch (item.shape) {
        case 'Rectangle':
            return <Rectangle item={item}/>
            break;
        case 'Rhombus':
            return <Rhombus item={item}/>
            break;
        case 'Circle':
            return <Circle item={item}/>
            break;
        case 'Ellipse':
            return <Ellipse item={item}/>
            break;
        case 'Parallelogram':
            return <Parallelogram item={item}/>
            break;

        case 'Triangle':
            return <Triangle item={item}/>
            break;
        case 'RoundRect':
            return <RoundRectangle item={item}/>
            break;

    }
}
