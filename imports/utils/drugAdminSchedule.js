import moment from 'moment';

export function dateFormatted(dt) {
    new moment(dt).format('D MMM YY hh:mm a')
}

export function calcHours(type) {
    hrs = 1;
    if (type === 'Day')
        hrs = 24;
    if (type === 'Week')
        hrs = 24 * 7;
    if (type === 'Month')
        hrs = 24 * 7 * 30;
    return hrs;
}

export function findUnits(item, durationHrs = 0) {
    durationHrs = durationHrs > 0 ? durationHrs : item.duration.for * calcHours(item.duration.type)
    //console.log(durationHrs)
    let oncePerX = calcHours(item.frequency.type) / item.frequency.every
    return durationHrs / oncePerX
}

export function calcSchedule(item) {
    total = findUnits(item)
    return calcShedByHours(item, total)
}

export function scheduleForTime(item, timeHrs) {
    total = findUnits(item, timeHrs)
    return calcShedByHours(item, total)
}


export function scriptEnhanced(script) {
    script.items = _.map(script.items, (item) => {
        //TODO user must be able to specfiy the start date themselves
        item['startDate'] =  item.createdAt ? item.createdAt : item.updatedAt ;
        item['endDate'] = new moment(item['startDate']).add(item.duration.for, item.duration.type.toLowerCase())
        item['unitsNeeded'] = item ? findUnits(item) : 0;
        item['isCurrent'] = new moment(item.endDate).isAfter(new moment());
        return item;
    })
    return script;
}

export function calcShedForIterval(item, start, end) {
    listRetDates = []
    total = findUnits(item)
    //let hrs = end.diff(start, 'hours')
    //console.log(`diff is ${hrs} ${total}`)
    let oncePerX = calcHours(item.frequency.type) / item.frequency.every

    for (j = 0; j < total; j++) {
        //TODO inefficient calculation - starts counting by start day - should be by  
        let occurence = new moment(item.startDate).add(oncePerX * j, 'hour')
       
        // let occurenceStartDiff = start.diff(occurence, 'hours') 
        // let occurenceEndDiff = end.diff(occurence, 'hours') 
        if(occurence.isBefore(start)  )
            continue;

        //console.log(occurenceEndDiff)
        if (occurence.isAfter(end) ) {
            //console.log(occurence.diff(end, 'hours'))
            break;
        }
        //console.log(occurence.format('D MMM YY hh:mm'))
        listRetDates.push(
            {
                dateToAdmin: occurence,
                item: item,
                isFuture: occurence.isAfter(new moment()) 
            })
    }//

    return listRetDates;
}

export function calcShedByHours(item, total) {
    listRetDates = []
    let oncePerX = calcHours(item.frequency.type) / item.frequency.every

    for (j = 0; j < total; j++) {
        //TODO inefficient calculation - starts counting by start day - should be by  
        let occurence = new moment(item.startDate).add(oncePerX * j, 'hour')
        //console.log(occurence.format('D MMM YY hh:mm'))
        listRetDates.push(
            {
                dateToAdmin: occurence,
                item: item
            })
    }//

    // var s = later.parse.text('every ' + oncePerX + "  hours");
    // occurences = later.schedule(s).next(total);
    //console.log(listRetDates)

    return listRetDates;
}