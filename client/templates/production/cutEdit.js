cutDateArray = [];
Template.cutEdit.onCreated(function() {
    cutDateArray = Events.find({prID: Session.get('prID'), categorie: 'schnitt'}).fetch();

    Session.set('cutDateArray', cutDateArray); // on page load, set this to have no inputs
});

Template.cutEdit.events({
    'click .datepicker': function(event){
        console.log("Klick auf Datum");
    }
});
Template.registerHelper('cutterUser', function (index) {
    var cutterUser = Session.get('cutDateArray');
    if(cutterUser[index].cutter == undefined)
        return '';
    else
        return cutterUser[index].cutter;
});
Template.cutEdit.helpers({



    production: function () {
        var prodID = Session.get('prID');
        return ProdList.findOne(prodID);
    },
    userList: function() {
        var member = Meteor.users.find({roles: 'Member'}).fetch();
        var redakteure = Meteor.users.find({roles: 'Redakteur'}).fetch();
        var admins = Meteor.users.find({roles: 'Admin'}).fetch();
        var result = member.concat(redakteure, admins);
        return result;
    },
    anzCutDates: function () {
        var anzCutDates = Session.get('cutDateArray');
        return anzCutDates.length;
    },
    cutDates: function () {
        return Session.get('cutDateArray');
    },
    userHasTaggedAsCutter: function(index){
        var currentUser = Meteor.user().profile.shortcode;
        var job = 'cutter';

        if(cutDateArray[index][job] == currentUser)
            return true;
        else
            return false;
    },

});

Template.cutEdit.events({
    'submit form': function(event, template) {
        event.preventDefault();
        var prodIDVar = Session.get('prID');
        var currTitle = Session.get('prTitle');
        //Hole Daten aus Input-Feldern
        for(i=0; i<cutDateArray.length; i++) {
            cutDateArray[i].schnittraum = template.find('#schnittraum'+ i).value;
            cutDateArray[i].besonderheiten = template.find('#besonderheiten'+ i).value;
            cutDateArray[i].start = template.find('#cutDateStart'+ i).value;
            cutDateArray[i].end = template.find('#cutDateEnd'+ i).value;
        }

        var currData = {
            prID: prodIDVar,
            title: 'Schnitt '+currTitle,
            color: '#9627BA',
            categorie: 'schnitt'
        };
        Meteor.call('upsertCutDate', currData, cutDateArray, function(err, result) {
            if(err)
                console.log(err);
            else
                console.log(result);
            Session.set("editCut", false);
        });
    },
    'click #cancelCutEdit': function(event){
        //setze Bearbeiten-Status auf nicht bearbeiten (0)
        Session.set("editCut", false);
        console.log("Bearbeiten: "+Session.get("editCut"));
    },

    'click #incrementDate': function(event){
        var currCutID = Random.id();
        var prIDVar = Session.get("prID");
        var currTitle = ProdList.findOne(prIDVar).title;
        var tempCutDate = {
            _id: currCutID,
            prID: prIDVar,
            title: 'Schnitt '+currTitle,
            start: moment().format('YYYY-MM-DD HH:mm'),
            end: moment().format('YYYY-MM-DD HH:mm'),
            color: '#9627BA',
            categorie: 'schnitt'
        };

        if(cutDateArray.length == 10) {
            alert('Maximale Anzahl von Schnitt-Terminen erreicht!')
        }
        else {
            cutDateArray.push(tempCutDate);
            Session.set('cutDateArray', cutDateArray);
            console.log(cutDateArray);
        }

    },
    'click #decrementDate': function(event){
        event.preventDefault();
        var prID = Session.get("prID");
        var currCutID = cutDateArray[cutDateArray.length-1]._id;
        //var currCutID = event.target.value;
        var index = cutDateArray.indexOf(currCutID); //suche index im array mit ID=currentSpeakerID
        console.log('ID='+currCutID+' index='+index);
        if(cutDateArray.length == 1)
        {
            alert('Minimum erreicht');
        }
        else {
            cutDateArray.splice(index, 1);
            Session.set('cutDateArray',cutDateArray);
            Events.remove(currCutID);
        }
    },

    'click #add_removeCutter': function(event){
        var job = 'cutter';
        var cutDateIndex = event.currentTarget.dataset.value;
        var currentUser = Meteor.user().profile.shortcode;

        var tmpData = cutDateArray[cutDateIndex];

        var selectorwithoutID = {};
        selectorwithoutID[job] = currentUser;
        var alreadyAdded = _.isMatch(tmpData, selectorwithoutID);

        if(alreadyAdded == false){
            _.extend(tmpData, selectorwithoutID);
            cutDateArray[cutDateIndex] = tmpData;
            Session.set('cutDateArray', cutDateArray);
            alert('User added')
        }
        else {
            delete cutDateArray[cutDateIndex][job];
            Session.set('cutDateArray', cutDateArray);
            alert('User removed');
        }

    },
    'click #addCutter': function (event, template) {
        var job = 'cutter'; //firstKamera
        var cutDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#cutter'+cutDateIndex).value;

        var tmpData = cutDateArray[cutDateIndex];

        var selectorwithoutID = {};
        selectorwithoutID[job] = taggedUser;
        var alreadyAdded = _.isMatch(tmpData, selectorwithoutID);

        if(alreadyAdded == true){
            alert('User already tagged in this Job')
        }
        else {
            _.extend(tmpData, selectorwithoutID);
            cutDateArray[cutDateIndex] = tmpData;
            Session.set('cutDateArray', cutDateArray);
            alert('User added')
        }
    },
    'click #removeCutter': function (event, template) {
        var job = 'cutter';
        var cutDateIndex = event.currentTarget.dataset.value;
        var taggedUser = template.find('#cutter'+cutDateIndex).value;

        var tmpData = cutDateArray[cutDateIndex];

        var selectorwithoutID = {};
        selectorwithoutID[job] = taggedUser;
        var alreadyAdded = _.isMatch(tmpData, selectorwithoutID);

        if(alreadyAdded == false){
            alert('User not tagged in this Job')
        }
        else {
            delete cutDateArray[cutDateIndex][job];
            Session.set('cutDateArray', cutDateArray);
            alert('User removed');
        }
    }
});


Template.cutEdit.onRendered(function() {
    var minDate = moment();
    minDate = minDate.subtract(1, "days");
    minDate = minDate.format('YYYY-MM-DD HH:mm');
    $(document).on('focus',".cutDateStart", function(){
        console.log('document focus');
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
    $(document).on('focus',".cutDateEnd", function(){
        console.log('document focus');
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