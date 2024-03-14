const Icon = ({icon, st}) => {

    const style = {
        backgroundImage: `url("/${icon}")`,
        backgroundSize: 'cover',
        width: '1rem',
        height: '1rem',
        display: "inline-block",
    }


    return (

        <>
            <i style={{...style, ...st}}/>
        </>

    )
}

export default Icon