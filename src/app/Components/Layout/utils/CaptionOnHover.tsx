import css from '../layout.module.css'


const CaptionOnHover = ({text, short}) => {

    const shortCut = {
        background: 'rgba(97, 97, 97, 0.79)',
        fontSize: '.8rem',
        borderRadius: '.1rem',
        padding: ".2rem .4rem",
        marginLeft: '.5rem'
    }

    return (
        <div className={css.caption}>
            {text}
            <span style={shortCut}>
                {short}
            </span>
        </div>
    )
}


export default CaptionOnHover