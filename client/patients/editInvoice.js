Template.EditInvoice.onCreated(function () {
    var self = this;
    this.inv = new ReactiveVar();

    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        //console.log(id)
        self.subscribe('InvoiceSingle', id);
        //self.subscribe()
        let invc = Invoices.findOne(id)
        self.subscribe('Rooms')
        self.subscribe('Beds')
        ////console.log(inv)
        if (invc) {
            self.inv.set(invc);
            adm = invc.admissionObj();
            //console.log(adm)
            self.subscribe('compAdmission', invc.admission);
        }
    });

});

Template.EditInvoice.helpers({
    admission: function () {
        ////console.log(Patients.findOne(FlowRouter.getParam('id')))
        return Template.instance().inv.get().admissionObj();
    },//Invoices.findOne(id).admissionObj()
    inv: function () {
        return Template.instance().inv.get();
    },

})