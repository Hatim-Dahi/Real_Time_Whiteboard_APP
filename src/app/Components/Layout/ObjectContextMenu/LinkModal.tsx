import React, {useState} from 'react';
import ContainerPopUp from "../../EditingPopUp/ContainerPopUp";
import css from "./ObjectWithModal.module.css";
import {IoClose} from "react-icons/io5";
import {addLink} from '../../../redux/shapesSlice';
import {useAppDispatch} from "../../../redux/hooks";

const LinkModal = ({id, isPresent, input, handleCloseLinkModal}) => {

    const dispatch = useAppDispatch()
    const [link, setLink] = useState('')

    const linkModalStyle = {
        position: "absolute",
        left: `150px`,
        top: `0px`
    }

    function handleInput(e) {
        setLink(e.target.value)
    }

    function handleConfirmLink() {
        let url;

        try {
            url = new URL(link);
        } catch (_) {
            return false;
        }
        if (url.protocol === "http:" || url.protocol === "https:") {
            dispatch(addLink({id: id, link: url}))
            handleCloseLinkModal()
        }
    }

    function handleDeleteLink() {
        dispatch(addLink({id: id, link: ''}))
        handleCloseLinkModal()

    }


    return (
        <div style={linkModalStyle}>
            <ContainerPopUp height={'300px'} width={'450px'}>
                <div className={css.absoluteClose}
                     onClick={handleCloseLinkModal}>
                    <IoClose/>
                </div>
                <div className={css.linkModal}>
                    <div className={css.linkModal_Header}>
                        Add external link
                    </div>
                    <div className={css.linkModal_Input}>
                        <input value={link}
                               onChange={handleInput}
                               ref={input}
                               onKeyDown={(e) =>
                                   e.stopPropagation()}
                        />
                    </div>
                    <div className={css.linkModal_Buttons}>
                        <button className={css.linkModal_ConfirmButton}
                                onClick={handleConfirmLink}>
                            Confirm
                        </button>
                        {isPresent &&
                            <button className={css.linkModal_DeleteButton}
                                    onClick={handleDeleteLink}>
                                Delete link
                            </button>
                        }

                    </div>

                </div>

            </ContainerPopUp>
        </div>
    );
};

export default LinkModal;