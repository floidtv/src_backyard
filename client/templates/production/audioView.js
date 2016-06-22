Template.audioView.events({
    'click #editAudio': function(event){
        //setze Bearbeiten-Status auf bearbeiten (1)
        Session.set("editAudio", true);
        console.log("Bearbeiten: "+Session.get("editAudio"))
    }
});
Template.audioView.helpers({
    production: function () {
        var prodID = Session.get('prID');
        return ProdList.findOne(prodID);
    },
    userList: function() {
        return Meteor.users.find().fetch();
    }
});
Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});

