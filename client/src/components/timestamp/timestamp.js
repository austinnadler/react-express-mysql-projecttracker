function TimeStamp(props) {
    console.log(props);
    var datetime = Date(props.datetime);
    var current = Date();
    var diff = Math.abs((current - datetime) * 1000);
    console.log(diff);
    return <div className="text-muted">{current} - {datetime}</div>
}
export default TimeStamp;