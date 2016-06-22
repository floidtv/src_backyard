Template.kameraView.events({
    'click #editKamera': function(event){
        //setze Bearbeiten-Status auf bearbeiten (1)
        Session.set("editKamera", true);
        console.log("Bearbeiten: "+Session.get("editKamera"))
    }
});
Template.kameraView.helpers({
    production: function () {
        var prodID = Session.get('prID');
        return ProdList.findOne(prodID);
    },
    userList: function() {
        return Meteor.users.find().fetch();
    },
    userHasTagged: function(){
        var currentUser = Meteor.user().profile.shortcode;
        return ProdList.findOne({_id: Session.get("prID") , redakteur: currentUser}) === undefined ? false : true
    },
    kameraDates: function () {
        return Events.find({prID: Session.get('prID'), categorie: 'kamera'}).fetch();
    },
});
Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});

