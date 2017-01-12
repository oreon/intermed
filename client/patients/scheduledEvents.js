Template.scheduledEvents.onCreated(function () {
    var self = this;
    self.autorun(function () {
        // var id = FlowRouter.getParam('id');
        // self.id = id;
        // self.subscribe('compPt', id);
    });
});

let getPtCharts = (pt) =>
    _(pt.appliedCharts)
        .map(x => Charts.findOne({ name: x }))
        .map('assesments')
        .flatten()
        .value()

let calcShed = (item) => {
    //console.log(item)
    //later.parse.recur().every(2).
    //var text = `every ${item.frequency.every} ${item.frequency.type.toLowerCase()}s`;
    //var s = later.parse.text(text);
    //console.log(text)   
    var s = later.parse.recur().every(item.frequency.every).dayOfYear();

    return { item: item, dates: later.schedule(s).next(3) };
}

let calcShedFlat = (item) => {
    var s = later.parse.recur().every(item.frequency.every).dayOfYear();
    let dates = later.schedule(s).next(3)
    return _(dates)
        .map(x => { return { item: item, date: x } })
        .value()
}

Template.scheduledEvents.helpers({

    getEvents: (pt) =>
        _(getPtCharts(pt))
            .map(calcShed)
            .value(),

    getEventsByDate: (pt) => {
        let items = _(getPtCharts(pt))
            .map(calcShedFlat)
            .flatten()
            .sortBy('date')
            .value()

        //console.log(items)
        return items;
    }

})
