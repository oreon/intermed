Template.doneCell.events({
  'click .done': function () {

    Meteor.call('markDone', this._id, function (error, response) {
            if (error) {
                Bert.alert(error.reason, "danger");
                console.log(error)
            } else {
                console.log(response)
                Bert.alert('Successfully marked done !', 'success', 'growl-top-right');
                //FlowRouter.go('/recipe/' + adm.patient)
            }
        });   
  }
});

Template.removeTodoCell.events({
  'click .remove': function () {
       Todos.remove(this._id);
  }
});