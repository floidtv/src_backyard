Template.treatmentView.events({
    'click #editTreatment': function(event){
        //setze Bearbeiten-Status auf bearbeiten (1)
        Session.set("editTreatment", true);
        console.log("Bearbeiten: "+Session.get("editTreatment"))
    },
    'click #addYourself': function(event){
        //füge sich selbst zum Treatment hinzu
        var prID = Session.get('prID');
        var currentUser = Meteor.user().profile.shortcode;
        var hasValue = ProdList.findOne({_id: prID , treatmentTeilnehmer: currentUser}) === undefined ? false : true
        if(hasValue == true){
            alert('User already tagged in this Production')
        }
        else {
            ProdList.update(prID, {
                $addToSet: {
                    treatmentTeilnehmer: currentUser
                }
            });
            alert('User added')
        }
    },
    'click #removeYourself': function(event){
        //entferne sich selbst vom treatment
        var prID = Session.get('prID');
        var currentUser = Meteor.user().profile.shortcode;
        var hasValue = ProdList.findOne({_id: prID , treatmentTeilnehmer: currentUser}) === undefined ? false : true
        if(hasValue == false){
            alert('There is no user to remove')
        }
        else {
            ProdList.update(prID, {
                $pull: {
                    treatmentTeilnehmer: currentUser
                }
            });
            alert('User removed')
        }
    }

});
Template.treatmentView.helpers({
    production: function () {
        var prodID = Session.get('prID');
        return ProdList.findOne(prodID);
    },
    userList: function() {
        return Meteor.users.find().fetch();
    },
    sprechertage: function(){
        return Events.find({prID: Session.get('prID'), categorie: 'speaker'}).fetch()
    },
    treatmentDate: function () {
        var prodID = Session.get('prID');
        var tmpTreatmentDate = Events.findOne({prID: prodID, categorie: 'treatment'});
        if(tmpTreatmentDate !== undefined){
            return tmpTreatmentDate.start;
        }
    },
    oTonHasTagged: function () {
        return (ProdList.findOne(Session.get("prID")).oTon === true) ? 'checked' : '';
    }
});
