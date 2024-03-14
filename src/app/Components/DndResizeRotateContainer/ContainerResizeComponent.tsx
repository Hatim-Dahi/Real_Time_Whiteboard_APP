import {createContext, Dispatch, useRef} from "react";
import css from './ContainerResize.module.css'
import * as React from "react";
import {useResizeLogic} from "../shape/useResizeLogic";
import {GrRotateRight} from "react-icons/gr";
import Selected from "../Selection/Selected";
import {useContainerResize} from "./useContainerResize";
import {useAppSelector} from "../../redux/hooks";

export const ObjectContext = createContext<Editable | null>(null);

interface Editable {
    x: number,
    y: number,
    w: number,
    h: number,
    category?: string,
    editMode?: boolean,
    down?: boolean,
    link?: URL | string
}

const ContainerResizeComponent = ({editorObject, renderProp, saveChanges, children, isUsable = "Selection"}: {
    isUsable: string,
    editorObject: Editable,
    saveChanges: Function
    renderProp?: (obj) => React.ReactNode,
    setOption?: Dispatch<string>,
    children?: React.ReactNode,
}) => {


    const container = useRef()
    const child = useRef()
    const overlay = useRef()
    const editCurveStatus = useAppSelector(state => state.present.curve.status)

    const {
        handleClearDir,
        handleMouseOver,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        addCurve,
        toggle,
        object,
        center,
        editMode,
        down,
        TextStyle,
        overlayStyle
    } = useContainerResize(editorObject, isUsable, child, container, saveChanges)

    useResizeLogic(() => {
    }, handleMouseUp, handleMouseMove, down, toggle)

    function handleEnterCurve(e) {
        overlay.current.style.background = "rgba(128, 128, 128, 0.1)"

    }

    function handleLeaveCurve(e: MouseEvent) {
        if (overlay.current.contains(e.relatedTarget)) return
        overlay.current.style.background = "transparent"
    }

    const linkStyle = {
        backgroundImage: `url(https://s2.googleusercontent.com/s2/favicons?domain_url=${editorObject?.link?.href})`,
    }

    return (

        <ObjectContext.Provider
            value={{
                ...object,
                center,
                category: 'object',
                down,
                editMode
            }}>
            <div ref={container}>
                <div style={TextStyle}
                     ref={overlay}
                     onMouseDown={handleMouseDown}>
                    <div className={css.hoverContainer}
                         onMouseOver={editCurveStatus ? handleEnterCurve : undefined}
                         onMouseOut={handleLeaveCurve}
                         style={overlayStyle}
                    />
                    {editorObject?.link &&
                        <a href={editorObject.link.href} target={'_blank'}>
                            <div className={css.link} style={linkStyle}/>
                        </a>
                    }
                    {editMode &&
                    <>
                        <div onMouseDown={(e) => e.stopPropagation()}>
                            <div className={`${css.curveControl} ${css.top}`} onClick={addCurve}/>
                            <div className={`${css.curveControl} ${css.right}`} onClick={addCurve}/>
                            <div className={`${css.curveControl} ${css.left}`} onClick={addCurve}/>
                            <div className={`${css.curveControl} ${css.bottom}`} onClick={addCurve}/>
                        </div>
                        <div className={'lt'}
                             onMouseOver={() => handleMouseOver("lt")}
                             onMouseLeave={handleClearDir}
                        />
                        <div className={'rt'}
                             onMouseOver={() => handleMouseOver("rt")}
                             onMouseLeave={handleClearDir}
                        />
                        <div className={'bl'}
                             onMouseOver={() => handleMouseOver("bl")}
                             onMouseLeave={handleClearDir}
                        />
                        <div className={'br'}
                             onMouseOver={() => handleMouseOver("br")}
                             onMouseLeave={handleClearDir}
                        />
                        <div className={'left'}
                             onMouseOver={() => handleMouseOver("left")}
                             onMouseLeave={handleClearDir}
                        />
                        <div className={'right'}
                             onMouseOver={() => handleMouseOver("right")}
                             onMouseLeave={handleClearDir}
                        />
                        <div className={'rotate'}
                             onMouseOver={() => handleMouseOver("rotate")}
                             onMouseLeave={handleClearDir}
                        >
                            <GrRotateRight/>
                        </div>
                        {object?.shape !== "Circle" &&
                        <>
                            <div className={'top'}
                                 onMouseOver={() => handleMouseOver("top")}
                                 onMouseLeave={handleClearDir}
                            />
                            <div className={'bottom'}
                                 onMouseOver={() => handleMouseOver("bottom")}
                                 onMouseLeave={handleClearDir}
                            />
                        </>
                        }
                    </>
                    }
                    <Selected isSelected={editorObject?.selected || false} object={object}>
                        <div ref={child}>
                            {children}
                        </div>
                    </Selected>
                </div>

                <div>
                    {renderProp &&
                    renderProp({
                        ...object,
                        center,
                        category: 'object',
                        down,
                        editMode
                    })
                    }
                </div>

            </div>

        </ObjectContext.Provider>


    )

}

export default ContainerResizeComponent