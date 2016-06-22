speakerDateIDs = [];
speakerDateArray = [];
markedIDs = [];

Template.treatmentEdit.onCreated(function() {
    var currSpeakerEvents = Events.find({prID: Session.get('prID'), categorie: 'speaker'}).fetch();
    for(i=0; i<currSpeakerEvents.length; i++)
    {
        speakerDateIDs[i] = currSpeakerEvents[i]._id;
        speakerDateArray[i] = currSpeakerEvents[i];
        //console.log('load DateID='+speakerDateIDs[i]);
        //console.log('load speakerDate='+speakerDateArray[i]);
    }
    markedIDs = [];
    Session.set('markedIDs', markedIDs);
    Session.set('speakerDateArray', currSpeakerEvents); // on page load, set this to have no inputs
    //console.log(currSpeakerEvents);
});

Template.treatmentEdit.events({
    'click .datepicker': function(event){
        //console.log("Klick auf Datum");
    }
});
Template.treatmentEdit.helpers({
    production: function () {
        var prodID = Session.get('prID');
        return ProdList.findOne(prodID);
    },
    treatmentDate: function () {
        var prodID = Session.get('prID');
        var tmpTreatmentDate = Events.findOne({prID: prodID, categorie: 'treatment'});
        if(tmpTreatmentDate !== undefined){
            return tmpTreatmentDate.start;
        }
    },
    userList: function() {
        var member = Meteor.users.find({roles: 'Member'}).fetch();
        var redakteure = Meteor.users.find({roles: 'Redakteur'}).fetch();
        var admins = Meteor.users.find({roles: 'Admin'}).fetch();
        var result = member.concat(redakteure, admins);
        return result;
    },
    userHasTaggedAsRedakteur: function(){
        var currentUser = Meteor.user().profile.shortcode;
        return ProdList.findOne({_id: Session.get("prID") , redakteur: currentUser}) === undefined ? false : true
    },
    userHasTaggedAsSpeaker: function(){
        var currentUser = Meteor.user().profile.shortcode;
        return ProdList.findOne({_id: Session.get("prID") , einsprecher: currentUser}) === undefined ? false : true
    },
    oTonHasTagged: function () {
        return (ProdList.findOne(Session.get("prID")).oTon === true) ? 'checked' : '';
    },
    sprechertage: function(){
        return Session.get('speakerDateArray');
    },
    array: function() {
        return speakerDateIDs;
    }
});

Template.treatmentEdit.events({

    'submit form': function(event, template) {
        //setze Bearbeiten-Status auf nicht bearbeiten (0)

        event.preventDefault();
        var prodIDVar = Session.get('prID');
        var currTitle = Session.get('prTitle');
        var ideaVar = event.target.idea.value;
        var offtextVar = event.target.offtext.value;
        var bildertextVar = event.target.bildertext.value;
        var treatmentDateVar = event.target.treatmentDate.value;

        var hyperlinksVar = event.target.hyperlinks.value;
        var oTonVar = event.target.oTon.checked;
        if(oTonVar == true)
        {
            var iPartnerVar = event.target.iPartner.value;
            var ipFunktionVar = event.target.ipFunktion.value;
            var ipKontaktVar = event.target.ipKontakt.value;
            var fragenVar = event.target.fragen.value;
        }
        else {
            var iPartnerVar = '';
            var ipFunktionVar = '';
            var ipKontaktVar = '';
            var fragenVar = '';
        }


        //check ob Redakteur eingetragen, aber kein Datum angegeben oder andersrum
        if(ProdList.findOne(prodIDVar).redakteur === undefined || ProdList.findOne(prodIDVar).redakteur.length === 0 && treatmentDateVar !== '')
        {
            event.preventDefault();
            alert('Bitte Redakteur eingetragen');
        }
        else if(ProdList.findOne(prodIDVar).redakteur !== undefined && treatmentDateVar === '')
        {
            event.preventDefault();
            alert('Bitte Fertigstellungsdatum eintragen');
        }
        else
        {
            Meteor.call('updateTreatmentDate', prodIDVar, currTitle, treatmentDateVar);
            //Session.set("editTreatment", false);
            //console.log("Bearbeiten: " + Session.get("editTreatment"));
            //console.log('Neuer Treatment-Termin eingetragen');

            //Check Sprecher
            //var speakerDateArr = Events.find({prID: prodIDVar, categorie: 'speaker'}).fetch();

            //Schleife für SpeakerDates
            //if(speakerDateArr !== undefined)

            var noErr;

            if(speakerDateArray !== undefined)
            {
                for(i=0; i<speakerDateArray.length; i++)
                {

                    var speakerdateStartString = '#speakerDateStart'+ i;
                    var speakerdateEndString = '#speakerDateEnd'+ i;
                    var speakerDateStartVar = template.find(speakerdateStartString).value;
                    var speakerDateEndVar = template.find(speakerdateEndString).value;
                    var speakerDateID = speakerDateArray[i]._id;
                    if(ProdList.findOne(prodIDVar).einsprecher !== undefined && template.find(speakerdateStartString).value === '' ) //wenn kein Offtext-Termin eingetragen
                    {
                        alert('Bitte Offtext-Beginn eintragen');
                        event.preventDefault();
                    }
                    else if(ProdList.findOne(prodIDVar).einsprecher !== undefined && template.find(speakerdateEndString).value === '' ) //wenn kein Offtext-Termin eingetragen
                    {
                        alert('Bitte Offtext-Ende eintragen');
                        event.preventDefault();
                    }
                    else if (ProdList.findOne(prodIDVar).einsprecher === undefined
                        || ProdList.findOne(prodIDVar).einsprecher.length === 0
                        && template.find(speakerdateStartString).value !== ''
                        && template.find(speakerdateEndString).value !== '')
                    {
                        Bert.alert('Bitte Einsprecher eintragen!', 'danger');
                        event.preventDefault();
                    }
                    else {
                        var currData = {_id: speakerDateArray[i]._id,
                            prID: prodIDVar,
                            title: 'Offtext: '+currTitle,
                            start: speakerDateStartVar,
                            end: speakerDateEndVar};

                        Meteor.call('delayedDateCompare', currData, function(err, result) {
                            console.log('err: ' + err + ' result: ' + result);
                            if(result === true){
                                Bert.alert('Angegebener Zeitraum schon gebucht. Bitte überprüfen Sie Ihre Eingaben!','danger');
                                speakerDateArray[i-1].flagged = true; //setze Datensatz auf flagged
                            }
                            else{
                                Bert.alert('Datum hinzugefügt!', 'success');
                                speakerDateArray[i-1].flagged = false; //setze Datensatz auf nicht flagged
                            }
                            Session.set('speakerDateArray', speakerDateArray);
                        });
                    }
                    if(speakerDateArray[i].flagged === false){
                        noErr = true;
                    }
                    else {
                        noErr = false;
                    }
                }
            }
        }

        console.log('noErr: '+noErr);

        ProdList.update(prodIDVar, {
            $set: {
                idea: ideaVar,
                offtext: offtextVar,
                bildertext: bildertextVar,
                hyperlinks: hyperlinksVar,
                oTon: oTonVar,
                iPartner: iPartnerVar,
                ipFunktion: ipFunktionVar,
                ipKontakt: ipKontaktVar,
                fragen: fragenVar }
        });
        Session.set("editTreatment", false);

    },
    'click #cancelTreatment': function(event){
        //setze Bearbeiten-Status auf nicht bearbeiten (0)
        Session.set("editTreatment", false);
        console.log("Bearbeiten: "+Session.get("editTreatment"))
    },
    //Redakteur hinzufügen/entfernen
    'click #add_removeRedakteur': function(event){
        //füge sich selbst zur Kamera hinzu
        var prID = Session.get('prID');
        var currentUser = Meteor.user().profile.shortcode;
        var hasValue = ProdList.findOne({_id: prID , redakteur: currentUser}) === undefined ? false : true
        if(hasValue == true){
            ProdList.update(prID, {
                $pull: {
                    redakteur: currentUser
                }
            });
            Bert.alert('User removed', 'success');
        }
        else {
            ProdList.update(prID, {
                $push: {
                    redakteur: currentUser
                }
            });
            Bert.alert('User added', 'success');
        }
    },
    'click #addRedakteur': function (ev, template) {
        var taggedUser = template.find('#multi-select').value;
        var prID = Session.get('prID')
        var hasValue = ProdList.findOne({_id: prID , redakteur: taggedUser}) === undefined ? false : true
        if(hasValue == true){
            Bert.alert('User already tagged in this Treatment', 'danger')
        }
        else {
            ProdList.update(prID, {
                $push: {
                    redakteur: taggedUser
                }
            });
            Bert.alert('User added','success')
        }
    },
    'click #removeRedakteur': function (ev, template) {
        var taggedUser = template.find('#multi-select').value;
        var prID = Session.get('prID')
        var hasValue = ProdList.findOne({_id: prID , redakteur: taggedUser}) === undefined ? false : true
        if(hasValue == false){
            Bert.alert('User is not tagged', 'danger')
        }
        else {
            ProdList.update(prID, {
                $pull: {
                    redakteur: taggedUser
                }
            });
            Bert.alert('User removed', 'success')
        }
    },
    //Einsprecher hinzufügen/entfernen
    'click #add_removeSpeaker': function(event){
        var prID = Session.get('prID');
        var currentUser = Meteor.user().profile.shortcode;
        var hasValue = ProdList.findOne({_id: prID , einsprecher: currentUser}) === undefined ? false : true
        if(hasValue == true){
            ProdList.update(prID, {
                $pull: {
                    einsprecher: currentUser
                }
            });
            Bert.alert('User removed', 'success')
        }
        else {
            ProdList.update(prID, {
                $push: {
                    einsprecher: currentUser
                }
            });
            Bert.alert('User added', 'success')
        }
    },
    'click #addSpeaker': function (ev, template) {
        var taggedUser = template.find('#multi-select2').value;
        var prID = Session.get('prID')
        var hasValue = ProdList.findOne({_id: prID , einsprecher: taggedUser}) === undefined ? false : true
        if(hasValue == true){
            Bert.alert('User already tagged in this Exposé', 'danger')
        }
        else {
            ProdList.update(prID, {
                $push: {
                    einsprecher: taggedUser
                }
            });
            Bert.alert('User added', 'success')
        }
    },
    'click #removeSpeaker': function (ev, template) {
        var taggedUser = template.find('#multi-select2').value;
        var prID = Session.get('prID')
        var hasValue = ProdList.findOne({_id: prID , einsprecher: taggedUser}) === undefined ? false : true
        if(hasValue == false){
            Bert.alert('User is not tagged', 'danger')
        }
        else {
            ProdList.update(prID, {
                $pull: {
                    einsprecher: taggedUser
                }
            });
            Bert.alert('User removed','success')
        }
    },
    //Einsprechtermin hinzufügen/entfernen

    'click #addSpeakerDate': function(event) {

        var currSpeakerID = Random.id();
        var prIDVar = Session.get("prID");
        var currTitle = ProdList.findOne(prIDVar).title;
        var speakerDates = {};

        speakerDates._id = currSpeakerID;
        speakerDates.prID = prIDVar;
        speakerDates.title = 'Offtext '+currTitle;
        speakerDates.start = moment().format('YYYY-MM-DD HH:mm');
        speakerDates.end = moment().format('YYYY-MM-DD HH:mm');
        speakerDates.color = '#009C95';
        speakerDates.categorie = 'speaker';
        speakerDates.flagged = false;
        if(speakerDateArray.length == 5) {
            Bert.alert('Maximale Anzahl von Offtext-Terminen erreicht!','danger')
        }
        else {
            speakerDateArray.push(speakerDates);
            Session.set('speakerDateArray', speakerDateArray);
            console.log(speakerDateArray);
        }

    }
    });
Template.treatmentEdit.onRendered(function() {
    this.$('#redakteurDatetimepicker').datetimepicker({
        //altes Format format: 'L',
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            horizontal: 'left',
            vertical: 'bottom'
        },
        locale:'de'
    });
    var prodIDVar = Session.get('prID');

    $(document).ready(function () {
        $(".oTonCheck").change(function () {
            if($(this).prop('checked')) {

                console.log('=checked');
                ProdList.update(prodIDVar, {
                    $set: {
                        oTon: true
                    }
                });

            }
            else {
                ProdList.update(prodIDVar, {
                    $set: {
                        oTon: false
                    }
                });
                console.log('=un-checked');

            }

        });
    });

});



