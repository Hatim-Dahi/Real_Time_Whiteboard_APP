import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../redux/hooks";
import ObjectWithModal from './ObjectContextMenu/ObjectWithModal';

const LayersComponent = ({isUsable}: {
    isUsable: string
}) => {


    const drawings: object[] = useAppSelector(state => state.present.drawing.drawings)
    const curves: object[] = useAppSelector(state => state.present.curve.curves)
    const shapes: object[] = useAppSelector(state => state.present.shape.shapes)
    const texts: object[] = useAppSelector(state => state.present.text.texts)

    const [objects, setObjects] = useState<object[]>([])


    useEffect(() => {
        updateCollection((el) => {
            return !!el?.curve
        }, curves)
    }, [curves])

    useEffect(() => {
        updateCollection((el) => {
            return !!el?.stroke
        }, drawings)
    }, [drawings])

    useEffect(() => {
        updateCollection((el) => {
            return !!el?.shape
        }, shapes)
    }, [shapes])

    useEffect(() => {
        updateCollection((el) => {
            return !(!!el?.shape || !!el?.stroke || !!el?.curve)
        }, texts)
    }, [texts])


    function updateCollection(checkFunction: Function, collection: object[]) {
        let len = objects.filter(el => checkFunction(el)).length
        if (len < collection.length) {
            setObjects(prevState => {
                if (collection === curves) {
                    return [collection[collection.length - 1], ...prevState]

                } else {
                    return [...prevState, collection[collection.length - 1]]
                }
            })
        } else if (len === collection.length) {
            setObjects(prevState => prevState.map(el => {
                if (checkFunction(el)) {
                    let item = collection.find(item => item.id === el.id)
                    if (item) return item
                }
                return el
            }))
        } else {
            setObjects(prevState => prevState.filter(el => {
                if (checkFunction(el) && !collection.find(o => o.id === el.id))
                    return false
                return true
            }))
        }
    }


    function handleBringToTop(id: number) {
        setObjects(prev => {
            let temp = [...prev]
            temp.push(prev[id])
            temp.splice(id, 1)
            return temp
        })
    }

    function handleBringToBottom(id: number) {
        setObjects(prev => {
            let temp = [...prev]
            temp.unshift(prev[id])
            temp.splice(id + 1, 1)
            return temp
        })
    }


    return (
        <>

            {objects &&
            objects.map((el, id) => {
                let key = el?.shape ? el.id : el?.curve ? "c" + el.id : el?.stroke ? "d" + el.id : "t" + el.id
                return <ObjectWithModal
                    key={key}
                    isUsable={isUsable}
                    handleBottom={() => handleBringToBottom(id)}
                    handleTop={() => handleBringToTop(id)}
                    el={el}/>
            })
            }

        </>
    );
};


export default LayersComponent;