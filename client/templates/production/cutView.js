Template.cutView.events({
    'click #editCut': function(event){
        //setze Bearbeiten-Status auf bearbeiten (1)
        Session.set("editCut", true);
        console.log("Bearbeiten: "+Session.get("editCut"))
    }
});
Template.cutView.helpers({
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
    cutDates: function () {
        return Events.find({prID: Session.get('prID'), categorie: 'schnitt'}).fetch();
    },
});
Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});

