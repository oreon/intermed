Template.EditEncounter.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        console.log(id)
        self.subscribe('EncounterSingle', id)
        enc = Encounters.findOne(id)
        if(enc)
        self.subscribe('compPt', enc.patient);
    });
});

Template.EditEncounter.helpers( {
    enc : () => Encounters.findOne(FlowRouter.getParam('id'))
    
});

