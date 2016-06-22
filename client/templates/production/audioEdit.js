audioUser = '';
Template.audioEdit.onCreated(function() {
    audioUser = ProdList.findOne(Session.get('prID')).audioUser;
    Session.set('audioUser', audioUser); // on page load, set this to have no inputs
});

Template.registerHelper('crUser', function (index) {
    var audioUser = Session.get('audioUser');
    if(audioUser == undefined)
        return '';
    else
        return audioUser;
});
Template.audioEdit.helpers({



    production: function () {
        var prodID = Session.get('prID');
        return ProdList.findOne(prodID);
    },
    crUserList: function() {
        var crMember = Meteor.users.find({roles: 'CampusRecords'}).fetch();
        return crMember;
    },
    userList: function() {
        return Meteor.users.find({roles: 'CampusRecords'}).fetch();
    },
});

Template.audioEdit.events({
    'submit form': function(event, template) {
        event.preventDefault();
        var audioUserVar = audioUser;
        var aBesonderheitenVar = template.find('#audiobesonderheiten').value;

        var result = ProdList.update(Session.get('prID'), {
            $set: {
                audioUser: audioUserVar,
                audioBesonderheiten: aBesonderheitenVar
            }
        });
        if(result == 1) {
            Session.set('editAudio', false)
        }

    },
    'click #cancelAudioEdit': function(event){
        //setze Bearbeiten-Status auf nicht bearbeiten (0)
        Session.set("editAudio", false);
        console.log("Bearbeiten: "+Session.get("editAudio"));
    },
    'click #add_AudioUser': function (event, template) {
        var taggedUser = template.find('#audioUser').value;

        if(audioUser == taggedUser){
            alert('User already tagged in this Job')
        }
        else {
            audioUser = taggedUser;
            Session.set('audioUser', audioUser);
            alert('User added')
        }

    },
    'click #remove_AudioUser': function (event, template) {
        var taggedUser = template.find('#audioUser').value;

        if(audioUser == taggedUser){
            audioUser = '';
            Session.set('audioUser', audioUser);
            alert('User removed')
        }
        else {
            alert('User not tagged in this Job');
        }

    }
});
