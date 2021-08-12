function TimeStamp(props) {
    let current = new Date();

    let prefix;
    let datetime;

    if(props.updated) {
        prefix = "Updated";
        datetime = new Date(props.updated);
    } else {
        prefix = "Created";
        datetime = new Date(props.created);
    }
    
    let diff;
    let rawDiff = Math.abs(current - datetime); // milliseconds
    let diffMin = conditionalRound(rawDiff / (1000 * 60)); // minutes
    let diffHr = conditionalRound(rawDiff / (1000 * 60 * 60)); // hours
    let diffD = conditionalRound(rawDiff / (1000 * 60 * 60 * 24)); // days
    let diffMo = conditionalRound(rawDiff / (1000 * 60 * 60 * 24 * 30)); // months
    let diffYr = conditionalRound(rawDiff / (1000 * 60 * 60 * 24 * 365)); // months
    
    if(diffHr >= 1 && diffD < 1) {
        diff = diffHr + "h ago";
    }

    if(diffD >= 1 && diffMo < 1) {
        diff = diffD + "d ago";
    }

    if(diffMo >= 1 && diffYr < 1) {
        diff = diffMo + "mo ago";
    }

    if(diffYr >= 1) {
        diff = diffYr + "y ago";
    }

    if(diffMin >= 1 && diffHr < 1) {
        diff = diffMin + "m ago";
    }

    if(diffMin < 1) {
        diff = "just now";
    }
    
    return <div className="text-muted">{prefix} {diff}</div>
}

// Round up if radix of n > .899 else round down
function conditionalRound(n) {
    var radix = n % 1.0;
    if( radix > 0.899 && radix < 1.0 ) {
        return Math.ceil(n);
    }
    else {
        return Math.floor(n);
    }
}

export default TimeStamp;