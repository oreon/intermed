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
    ////console.log(durationHrs)
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
    if(!script)
        return;
    script.scriptItems = _.map(script.scriptItems, (item) => {
        //TODO user must be able to specfiy the start date themselves
        // item['startDate'] =  item.createdAt ? item.createdAt : item.updatedAt ;
        //item['endDate'] = new moment(item['startDate']).add(item.duration.for, item.duration.type.toLowerCase())
        item['unitsNeeded'] = item ? findUnits(item) : 0;
        item['isCurrent'] = new moment(item.endDate).isAfter(new moment());
        return item;
    })
    return script;
}

export function calcShedForIterval(item, start, end) {
    listRetDates = []
    //total = findUnits(item)
    //let hrs = end.diff(start, 'hours')
    ////console.log(`diff is ${hrs} ${total}`)
    if(!item || !item.frequency)
        return ;
    let oncePerX = calcHours(item.frequency.type) / item.frequency.every
    if(item.frequency.type == "Day" && item.route != 'IV'){

    }

    let sched4x = later.parse.recur().on('7:00', '11:00', '15:00', '20:00').time() //.onWeekday();
    let sched3x = later.parse.recur().on('7:00', '14:00', '20:00').time() //.onWeekday();
    let sched2x = later.parse.recur().on( '14:00', '20:00').time()
    let sched1x = later.parse.recur().on( '14:00').time()
    scheds = [sched1x, sched2x, sched3x, sched4x]

    later.date.localTime();
    // //console.log( later.schedule(sched3x).next(3) );
    // //console.log ( later.schedule(sched3x).prev(3) ) ;
    

    j = 0; // oncePerX ==1 ?0 :1 ;
    let occurence = new moment(item.startDate)
    //for (j = 0; j < total; j++) {
    while (occurence.isBefore(end)) {
        //TODO inefficient calculation - starts counting by start day - should be by  
        occurence = new moment(item.startDate).add(oncePerX * j++, 'hour')

        if (occurence.isAfter(start) && occurence.isBefore(end))  {
            listRetDates.push(
                {
                    dateToAdmin: occurence,
                    item: item,
                    isFuture: occurence.isAfter(new moment())
                })
        }
    }

    return listRetDates;
}

export function calcShedByHours(item, total) {
    listRetDates = []
    let oncePerX = calcHours(item.frequency.type) / item.frequency.every

    for (j = 0; j < total; j++) {
        //TODO inefficient calculation - starts counting by start day - should be by  
        let occurence = new moment(item.startDate).add(oncePerX * j, 'hour')
        ////console.log(occurence.format('D MMM YY hh:mm'))
        listRetDates.push(
            {
                dateToAdmin: occurence,
                item: item
            })
    }//

    // var s = later.parse.text('every ' + oncePerX + "  hours");
    // occurences = later.schedule(s).next(total);
    ////console.log(listRetDates)

    return listRetDates;
}
