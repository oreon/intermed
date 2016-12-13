import moment from 'moment'

export function calcDates(dateUpdated, frequency, duration){

    //{{frequency.every}} {{frequency.type}}
    startDate = new moment(dateUpdated)  ;    
    endDate = startDate.add(duration.for, duration.type);
    occurence = new moment();
    anotherTime = timeNow

    listRetDates = []
    let i = 1

    while (occurence < endDate) {
        for( j = 0; j < frequency.every ;j++ ){
            occurence = timeNow + datetime.timedelta(days = frequency * (i))
            listRetDates.push(occurence)
        }
    }

    _.forEach(listRetDates, function(elem){ print (elem)})

    return listRetDates
}