const TitleBar = (props) => {
    const className = "m-4 text-" + props.textColor;
    return (
        <div className="text-center">
            <h1 className={className}>{props.title}</h1>
        </div>
    )
}
export default TitleBar;