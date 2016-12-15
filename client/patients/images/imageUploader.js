Template.imageUploader.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var id = FlowRouter.getParam('id');
        self.id = id;
        Meteor.subscribe('images', Session.get('patient'))
        //console.log(result)
    });
});


Template.imageUploader.images = function () {
    return Images.find();
};

Template.imageUploader.events({
    'change #files': function(event, temp) {
      console.log('files changed');
      FS.Utility.eachFile(event, function(file) {
        var fileObj = new FS.File(file);
        fileObj.metadata = { owner: Session.get('patient') };
        Images.insert(fileObj);
      });
    },
    'dropped #dropzone': function(event, temp) {
      console.log('files droped');
      FS.Utility.eachFile(event, function(file) {
        var fileObj = new FS.File(file);
        fileObj.metadata = { owner: Session.get('patient') };
        Images.insert(fileObj);
      });
    },
    'click .btnRemove': function(event, temp) {
      this.remove();
    }
});