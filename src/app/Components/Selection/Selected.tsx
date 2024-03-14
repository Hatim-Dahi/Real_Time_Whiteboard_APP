

const Selected = ({isSelected,object,children}) => {

    const style = getStyle(object)


    return(
        <>
            {isSelected &&
            <div style={style}/>
            }
            {children}
        </>
    )


}

export default Selected


export function getStyle(item) {

    return {
        position: "absolute",
        border: '1px solid #3f42ff',
        left: -10,
        top: -10,
        width: item.w+38,
        height: item.h+38,
        zIndex: -100
    }
}