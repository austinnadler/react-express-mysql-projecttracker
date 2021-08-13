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

    function getString() {
        let rawDiff = Math.abs(current - datetime); // milliseconds
        let diffMin = conditionalRound(rawDiff / (1000 * 60), .5); // minutes
        let diffHr = conditionalRound(rawDiff / (1000 * 60 * 60), .899); // hours
        let diffD = conditionalRound(rawDiff / (1000 * 60 * 60 * 24), .899); // days
        let diffMo = conditionalRound(rawDiff / (1000 * 60 * 60 * 24 * 30), .899); // months
        let diffYr = conditionalRound(rawDiff / (1000 * 60 * 60 * 24 * 365), .899); // months
        
        if(diffD >= 1 && diffMo < 1) {
            return diffD + "d ago";
        }
    
        if(diffHr >= 1 && diffD < 1) {
            return diffHr + "h ago";
        }
    
        if(diffMo >= 1 && diffYr < 1) {
            return diffMo + "mo ago";
        }
    
        if(diffYr >= 1) {
            return diffYr + "y ago";
        }
    
        if(diffMin >= 1 && diffHr < 1) {
            return diffMin + "m ago";
        }
    
        if(diffMin < 1) {
            return "just now";
        }
    }
    
    // Round up if radix of n > .899 else round down
    function conditionalRound(n, bound) {
        var radix = n % 1.0;
        if( radix > bound && radix < 1.0 ) {
            return Math.ceil(n);
        }
        else {
            return Math.floor(n);
        }
    }
    return <div className="text-muted">{prefix} {getString()}</div>
}

export default TimeStamp;