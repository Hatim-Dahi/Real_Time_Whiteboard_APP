import React, {memo, useEffect, useRef, useState} from "react";
import {Point} from "../../../page";
import RenderResizeShape from "../../shape/RenderResizeShape";
import Curve from "../../BezierCurves/Curve";
import Draw from "../../Drawing/Draw";
import Text from "../../TextObject/Text";
import css from './ObjectWithModal.module.css'
import ContainerPopUp from "../../EditingPopUp/ContainerPopUp";
import {saveObjectInfo, removeShape} from "../../../redux/shapesSlice"
import LinkModal from "./LinkModal";
import {useAppDispatch} from "../../../redux/hooks";
import {removeCurve} from "../../../redux/curvesSlice";
import {removeDrawing} from "../../../redux/drawingSlice";
import {removeText} from "../../../redux/textSlice";

const ObjectWithModal = ({isUsable, handleBottom, handleTop, el}) => {

    const dispatch = useAppDispatch()
    const [isModalActive, setIsModalActive] = useState(false)
    const [isLinkModalActive, setIsLinkModalActive] = useState(false)
    const [isBackwards, setIsBackwards] = useState(false)
    const [mousePosition, setMousePosition] = useState<Point>({x: 0, y: 0})
    const input = useRef(null)

    const handleModal = (e) => {
        e.preventDefault()
        if (e.clientY > window.innerHeight - 220) {
            setIsBackwards(true)
        } else {
            setIsBackwards(false)
        }
        setMousePosition({x: e.clientX, y: e.clientY})
        setIsModalActive(!isModalActive)
    }

    const modalStyle = {
        position: "absolute",
        left: `${mousePosition.x + 20}px`,
        top: `${mousePosition.y - 70 - (isBackwards ? 210 : 0)}px`
    }


    function handleLinkTo() {
        setIsLinkModalActive(true)
        setTimeout(() => {
            input.current.focus()
        }, 100)
    }

    function handleCloseLinkModal() {
        setIsLinkModalActive(false)
    }

    function handleCopy() {
        dispatch(saveObjectInfo())
    }

    function handleDelete(id: number) {
        const func = el?.shape ? removeShape : el?.curve ? removeCurve : el?.stroke ? removeDrawing : removeText
        dispatch(func(id))
    }


    useEffect(() => {

        function handleContextMenuClose() {
            setIsModalActive(false)
        }

        if (isModalActive)
            window.addEventListener('mousedown', handleContextMenuClose, {
                once: true
            })

    }, [isModalActive])


    return (
        <>
            <div onContextMenu={handleModal}>
                {el?.shape ?
                    <RenderResizeShape key={el.id} item={el}/>
                    : el?.curve ?
                        <Curve curve={el} isUsable={isUsable}
                               handleTop={handleTop}
                               handleBottom={handleBottom}

                        />
                        : el?.stroke ?
                            <Draw key={el.id} drawing={el} isUsable={isUsable}/>
                            :
                            <Text key={el.id} text={el}/>
                }
                {isModalActive &&
                <div style={modalStyle}>
                    <ContainerPopUp height={'210px'} width={'150px'}>
                        <div className={css.modal}>
                            <div className={css.modalItem} onMouseDown={handleTop}>
                                Bring to Front
                            </div>
                            <div className={css.modalItem} onMouseDown={handleBottom}>
                                Send to Back
                            </div>
                            <div className={css.modalItem} onMouseDown={handleLinkTo}>
                                {el?.link ? 'Edit Link' : 'Add Link'}
                            </div>
                            <div className={css.modalItem} onMouseDown={handleCopy}>
                                Copy
                            </div>
                            <div className={css.modalItem} onMouseDown={() => handleDelete(el.id)}>
                                Delete
                            </div>

                        </div>
                    </ContainerPopUp>
                </div>
                }
            </div>
            {isLinkModalActive &&
            <LinkModal
                id={el?.shape ? el.id : el?.curve ? "c" + el.id : el?.stroke ? "d" + el.id : "t" + el.id}
                isPresent={!!el?.link}
                input={input}
                handleCloseLinkModal={handleCloseLinkModal}
            />
            }

        </>
    )
}

export default ObjectWithModal