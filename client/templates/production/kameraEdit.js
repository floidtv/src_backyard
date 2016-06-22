kameraDateArray = [];

Template.kameraEdit.onCreated(function() {
    kameraDateArray = Events.find({prID: Session.get('prID'), categorie: 'kamera'}).fetch();

    Session.set('kameraDateArray', kameraDateArray); // on page load, set this to have no inputs
});

Template.kameraEdit.events({
    'click .datepicker': function(event){
        console.log("Klick auf Datum");
    }
});


Template.kameraEdit.helpers({

    production: function () {
        var prodID = Session.get('prID');
        return ProdList.findOne(prodID);
    },
    kameraDates: function () {
        return Session.get('kameraDateArray');
    },
    anzKameraDates: function () {
        var anzKameraDates = Session.get('kameraDateArray');
        return anzKameraDates.length;
    },
    userList: function() {
        var member = Meteor.users.find({roles: 'Member'}).fetch();
        var redakteure = Meteor.users.find({roles: 'Redakteur'}).fetch();
        var admins = Meteor.users.find({roles: 'Admin'}).fetch();
        var result = member.concat(redakteure, admins);
        return result;
    },
    userHasTaggedAsFirstKamera: function(index){
        var currentUser = Meteor.user().profile.shortcode;
        var job = 1;
        var prodJob = getJob(job);
        if(kameraDateArray[index][prodJob] == currentUser)
            return true;
        else
            return false;
    },
    userHasTaggedAsSecondKamera: function(index){
        var currentUser = Meteor.user().profile.shortcode;
        var job = 2;
        var prodJob = getJob(job);
        if(kameraDateArray[index][prodJob] == currentUser)
            return true;
        else
            return false;
    },
    userHasTaggedAsKameraassistent: function(index){
        var currentUser = Meteor.user().profile.shortcode;
        var job = 3;
        var prodJob = getJob(job);
        if(kameraDateArray[index][prodJob] == currentUser)
            return true;
        else
            return false;
    },
    userHasTaggedAsTonmann: function(index){
        var currentUser = Meteor.user().profile.shortcode;
        var job = 4;
        var prodJob = getJob(job);
        if(kameraDateArray[index][prodJob] == currentUser)
            return true;
        else
            return false;
    },
    userHasTaggedAsTonassistent: function(index){
        var currentUser = Meteor.user().profile.shortcode;
        var job = 5;
        var prodJob = getJob(job);
        if(kameraDateArray[index][prodJob] == currentUser)
            return true;
        else
            return false;
    },
    userHasTaggedAsLichttechnik: function(index){
        var currentUser = Meteor.user().profile.shortcode;
        var job = 6;
        var prodJob = getJob(job);
        if(kameraDateArray[index][prodJob] == currentUser)
            return true;
        else
            return false;
    },
    userHasTaggedAsLichtassistent: function(index){
        var currentUser = Meteor.user().profile.shortcode;
        var job = 7;
        var prodJob = getJob(job);
        if(kameraDateArray[index][prodJob] == currentUser)
            return true;
        else
            return false;
    }
});

Template.registerHelper('firstKameraUser', function (index) {
    var firstkameraUser = Session.get('kameraDateArray');
    if(firstkameraUser[index].firstKamera == undefined)
        return '';
    else
        return firstkameraUser[index].firstKamera;
});
Template.registerHelper('secondKameraUser', function (index) {
    var secondKameraUser = Session.get('kameraDateArray');
    if(secondKameraUser[index].secondKamera == undefined)
        return '';
    else
        return secondKameraUser[index].secondKamera;
});
Template.registerHelper('kameraAssistentUser', function (index) {
    var kameraAssistentUser = Session.get('kameraDateArray');
    if(kameraAssistentUser[index].kameraassistent == undefined)
        return '';
    else
        return kameraAssistentUser[index].kameraassistent;
});
Template.registerHelper('tonmannUser', function (index) {
    var tonmannUser = Session.get('kameraDateArray');
    if(tonmannUser[index].tonmann == undefined)
        return '';
    else
        return tonmannUser[index].tonmann;
});
Template.registerHelper('tonassistentUser', function (index) {
    var tonassistentUser = Session.get('kameraDateArray');
    if(tonassistentUser[index].tonassistent == undefined)
        return '';
    else
        return tonassistentUser[index].tonassistent;
});
Template.registerHelper('lichttechnikUser', function (index) {
    var lichttechnikUser = Session.get('kameraDateArray');
    if(lichttechnikUser[index].lichttechnik == undefined)
        return '';
    else
        return lichttechnikUser[index].lichttechnik;
});
Template.registerHelper('lichtassistentUser', function (index) {
    var lichtassistentUser = Session.get('kameraDateArray');
    if(lichtassistentUser[index].lichtassistent == undefined)
        return '';
    else
        return lichtassistentUser[index].lichtassistent;
});

Template.kameraEdit.events({
    'submit form': function(event, template) {
        event.preventDefault();
        var prodIDVar = Session.get('prID');
        var currTitle = Session.get('prTitle');
        //Hole Daten aus Input-Feldern
        for(i=0; i<kameraDateArray.length; i++) {
            kameraDateArray[i].drehort = template.find('#drehort'+ i).value;
            kameraDateArray[i].besonderheiten = template.find('#besonderheiten'+ i).value;
            kameraDateArray[i].start = template.find('#kameraDateStart'+ i).value;
            kameraDateArray[i].end = template.find('#kameraDateEnd'+ i).value;
        }

        var currData = {
            prID: prodIDVar,
            title: 'Kamera '+currTitle,
            color: '#1678C2',
            categorie: 'kamera'
        };
        Meteor.call('upsertKameraDate', currData, kameraDateArray, function(err, result) {
            if(err)
                console.log(err);
            else
                console.log(result);
            Session.set("editKamera", false);
        });
    },
    'click #cancelKameraEdit': function(event){
        //setze Bearbeiten-Status auf nicht bearbeiten (0)
        Session.set("editKamera", false);
        console.log("Bearbeiten: "+Session.get("editKamera"));
    },

    'click #incrementDate': function(event){
        var currKameraID = Random.id();
        var prIDVar = Session.get("prID");
        var currTitle = ProdList.findOne(prIDVar).title;
        var tempKameraDate = {
            _id: currKameraID,
            prID: prIDVar,
            title: 'Kamera '+currTitle,
            start: moment().format('YYYY-MM-DD HH:mm'),
            end: moment().format('YYYY-MM-DD HH:mm'),
            color: '#1678C2',
            categorie: 'kamera'
        };

        if(kameraDateArray.length == 10) {
            alert('Maximale Anzahl von Kamera-Terminen erreicht!')
        }
        else {
            kameraDateArray.push(tempKameraDate);
            Session.set('kameraDateArray', kameraDateArray);
            console.log(kameraDateArray);
        }

    },
    'click #decrementDate': function(event){
        event.preventDefault();
        var prID = Session.get("prID");
        var currKameraID = kameraDateArray[kameraDateArray.length-1]._id;
        var index = kameraDateArray.indexOf(currKameraID); //suche index im array mit ID=currentSpeakerID
        //console.log('ID='+currSpeakerID+' index='+index);
        if(kameraDateArray.length == 1)
        {
            alert('Minimum erreicht');
        }
        else {
            kameraDateArray.splice(index, 1);
            Session.set('kameraDateArray',kameraDateArray);
            Events.remove(currKameraID);
        }
    },

    'click #add_removeFirstKamera': function(event){
        //füge sich selbst zur Kamera hinzu
        var job = 1; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var currentUser = Meteor.user().profile.shortcode;
        add_removeYourself(job,currentUser, kameraDateIndex);
    },
    'click #addFirstKamera': function (event, template) {
        var job = 1; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#firstKamera'+kameraDateIndex).value;
        var kameraDateID = kameraDateArray[kameraDateIndex]._id;
        addUserToJob(job,taggedUser, kameraDateIndex);
    },
    'click #removefirstKamera': function (event, template) {
        var job = 1; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#firstKamera'+kameraDateIndex).value;
        var kameraDateID = kameraDateArray[kameraDateIndex]._id;
        //console.log('KameraDateIndex: '+kameraDateIndex+' taggedUser: '+taggedUser+' ID: '+kameraDateID);
        removeUserFromJob(job,taggedUser, kameraDateIndex);
    },

    'click #add_removeSecondKamera': function(event){
        //füge sich selbst zur Kamera hinzu
        var job = 2; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var currentUser = Meteor.user().profile.shortcode;
        add_removeYourself(job,currentUser, kameraDateIndex);
    },
    'click #addSecondKamera': function (event, template) {
        var job = 2; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#secondKamera'+kameraDateIndex).value;
        addUserToJob(job,taggedUser, kameraDateIndex);
    },
    'click #removeSecondKamera': function (event, template) {
        var job = 2; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#secondKamera'+kameraDateIndex).value;
        removeUserFromJob(job,taggedUser, kameraDateIndex);
    },

    'click #add_removeKameraassistent': function(event){
        //füge sich selbst zur Kamera hinzu
        var job = 3; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var currentUser = Meteor.user().profile.shortcode;
        add_removeYourself(job,currentUser, kameraDateIndex);
    },
    'click #addKameraassistent': function (event, template) {
        var job = 3; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#kameraassistent'+kameraDateIndex).value;
        addUserToJob(job,taggedUser, kameraDateIndex);
    },
    'click #removeKameraassistent': function (event, template) {
        var job = 3; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#kameraassistent'+kameraDateIndex).value;
        removeUserFromJob(job,taggedUser, kameraDateIndex);
    },

    'click #add_removeTonmann': function(event){
        //füge sich selbst zur Kamera hinzu
        var job = 4; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var currentUser = Meteor.user().profile.shortcode;
        add_removeYourself(job,currentUser, kameraDateIndex);
    },
    'click #addTonmann': function (event, template) {
        var job = 4; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#tonmann'+kameraDateIndex).value;
        addUserToJob(job,taggedUser, kameraDateIndex);
    },
    'click #removeTonmann': function (event, template) {
        var job = 4; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#tonmann'+kameraDateIndex).value;
        removeUserFromJob(job,taggedUser, kameraDateIndex);
    },

    'click #add_removeTonassistent': function(event){
        //füge sich selbst zur Kamera hinzu
        var job = 5; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var currentUser = Meteor.user().profile.shortcode;
        add_removeYourself(job,currentUser, kameraDateIndex);
    },
    'click #addTonassistent': function (event, template) {
        var job = 5; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#tonassistent'+kameraDateIndex).value;
        addUserToJob(job,taggedUser, kameraDateIndex);
    },
    'click #removeTonassistent': function (event, template) {
        var job = 5; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#tonassistent'+kameraDateIndex).value;
        removeUserFromJob(job,taggedUser, kameraDateIndex);
    },

    'click #add_removeLichttechnik': function(event){
        //füge sich selbst zur Kamera hinzu
        var job = 6; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var currentUser = Meteor.user().profile.shortcode;
        add_removeYourself(job,currentUser, kameraDateIndex);
    },
    'click #addLichttechnik': function (event, template) {
        var job = 6; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#lichttechnik'+kameraDateIndex).value;
        addUserToJob(job,taggedUser, kameraDateIndex);
    },
    'click #removeLichttechnik': function (event, template) {
        var job = 6; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#lichttechnik'+kameraDateIndex).value;
        removeUserFromJob(job,taggedUser, kameraDateIndex);
    },

    'click #add_removeLichtassistent': function(event){
        //füge sich selbst zur Kamera hinzu
        var job = 7; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var currentUser = Meteor.user().profile.shortcode;
        add_removeYourself(job,currentUser, kameraDateIndex);
    },
    'click #addLichtassistent': function (event, template) {
        var job = 7; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#lichtassistent'+kameraDateIndex).value;
        addUserToJob(job,taggedUser, kameraDateIndex);
    },
    'click #removeLichtassistent': function (event, template) {
        var job = 7; //firstKamera
        var kameraDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#lichtassistent'+kameraDateIndex).value;
        removeUserFromJob(job,taggedUser, kameraDateIndex);
    }


});
//wenn Checkbox Change
/*
Template.kameraEdit.onRendered(function(){
    console.log('template rendered');
    var prodIDVar = Session.get('prID');

    $(document).ready(function () {
        $(".checkbox1").change(function () {
            if($(this).prop('checked')) {

                console.log('=checked');
                ProdList.update(prodIDVar, {
                    $set: {
                        secondDreh: true
                    }
                });

            }
            else {
                ProdList.update(prodIDVar, {
                    $set: {
                        secondDreh: false
                    }
                });
                console.log('=un-checked');

            }

        });
    })

});
*/

Template.kameraEdit.onRendered(function() {
    var minDate = moment();
    minDate = minDate.subtract(1, "days");
    minDate = minDate.format('YYYY-MM-DD HH:mm');
    $(document).on('focus',".kameraDateStart", function(){
        //console.log('document focus');
        $(this).datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            widgetPositioning: {
                horizontal: 'left',
                vertical: 'bottom'
            },
            locale:'de',
            showTodayButton: true,
            useCurrent: false,
            minDate: minDate,
            disabledDates: []
        });
    });
    $(document).on('focus',".kameraDateEnd", function(){
        //console.log('document focus');
        $(this).datetimepicker({
            format: 'YYYY-MM-DD HH:mm',
            widgetPositioning: {
                horizontal: 'left',
                vertical: 'bottom'
            },
            locale:'de',
            showTodayButton: true,
            useCurrent: false,
            minDate: minDate,
            disabledDates: []
        });
    });
});
function getJob(job)
{
    var prodJob;
    switch (job) {
        case 1:
            prodJob = 'firstKamera';
            break;
        case 2:
            prodJob = 'secondKamera';
            break;
        case 3:
            prodJob = 'kameraassistent';
            break;
        case 4:
            prodJob = 'tonmann';
            break;
        case 5:
            prodJob = 'tonassistent';
            break;
        case 6:
            prodJob = 'lichttechnik';
            break;
        case 7:
            prodJob = 'lichtassistent';
            break;
    }
    return prodJob;
}
function add_removeYourself(job, user, index)
{
    var prodJob = getJob(job);
    var tmpData = kameraDateArray[index];

    var selectorwithoutID = {};
    selectorwithoutID[prodJob] = user;
    var alreadyAdded = _.isMatch(tmpData, selectorwithoutID);

    if(alreadyAdded == false){
        addUserToJob(job,user, index);
        console.log('User added');
    }
    else {
        removeUserFromJob(job,user, index);
        console.log('User removed');
    }

}
function addUserToJob(job, user, index)
{
    var prodJob = getJob(job);
    var tmpData = kameraDateArray[index];

    var selectorwithoutID = {};
    selectorwithoutID[prodJob] = user;
    var alreadyAdded = _.isMatch(tmpData, selectorwithoutID);

    if(alreadyAdded == true){
        alert('User already tagged in this Job')
    }
    else {
        _.extend(tmpData, selectorwithoutID);
        kameraDateArray[index] = tmpData;
        Session.set('kameraDateArray', kameraDateArray);
        alert('User added')
    }
}

function removeUserFromJob(job, user, index)
{
    var prodJob = getJob(job);
    var tmpData = kameraDateArray[index];

    var selectorwithoutID = {};
    selectorwithoutID[prodJob] = user;
    var alreadyAdded = _.isMatch(tmpData, selectorwithoutID);

    if(alreadyAdded == false){
        alert('User not tagged in this Job')
    }
    else {
        delete kameraDateArray[index][prodJob];
        Session.set('kameraDateArray', kameraDateArray);
        alert('User removed');
    }
}
