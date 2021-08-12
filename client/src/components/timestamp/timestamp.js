function TimeStamp(props) {
    let datetime = new Date(props.datetime);
    let current = new Date();
    let prefix = props.prefix;
    
    let diff;
    let diffMin = Math.round(Math.abs(current - datetime) / (1000 * 60)); // minutes
    let diffHr = Math.round(Math.abs(current - datetime) / (1000 * 60 * 60)); // hours
    let diffD = Math.round(Math.abs(current - datetime) / (1000 * 60 * 60 * 24)); // days
    
    if(diffHr >= 1 && diffD < 1) {
        diff = diffHr + "h ago";
    }

    if(diffD >= 1) {
        diff = diffD + "d ago";
    }

    if(diffMin >= 1 && diffHr < 1) {
        diff = diffMin + "m ago";
    }

    if(diffMin < 1) {
        diff = "just now";
    }
    
    return <div className="text-muted">{prefix} {diff}</div>
}
export default TimeStamp;