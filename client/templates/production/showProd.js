//Return the content of the collection ProdList
Template.showProduction.helpers({
    production: function() {
        return ProdList.find();
    },
    eventDate: function() {
        var prID = ProdList.findOne({_id: this._id});
        if(prID !== undefined) {
            var event = Events.findOne({prID: prID._id, categorie: 'production'});
            if(event !== undefined)
                return event.start;
        }
    },
    //Ist eingeloggter Nutzer in Produktionen aktiv
    userTagged: function() {
        var currentUser = Meteor.user().profile.shortcode;
        var isUserRedakteur = ProdList.findOne({_id: this._id , redakteur: currentUser}) === undefined ? false : true;
        var isUserSpeaker = ProdList.findOne({_id: this._id , einsprecher: currentUser}) === undefined ? false : true
        var isUserfirstKamera = Events.findOne({prID: this._id , firstKamera: currentUser}) === undefined ? false : true;
        var isUsersecondKamera = Events.findOne({prID: this._id , secondKamera: currentUser}) === undefined ? false : true;
        var isUserKameraassistent = Events.findOne({prID: this._id , kameraassistent: currentUser}) === undefined ? false : true;
        var isUserTonmann = Events.findOne({prID: this._id , tonmann: currentUser}) === undefined ? false : true;
        var isUserTonassistent = Events.findOne({prID: this._id , tonassistent: currentUser}) === undefined ? false : true;
        var isUserLichttechnik = Events.findOne({prID: this._id , lichttechnik: currentUser}) === undefined ? false : true;
        var isUserLichtassistent = Events.findOne({prID: this._id , lichtassistent: currentUser}) === undefined ? false : true;
        var isUserCutter = Events.findOne({prID: this._id , cutter: currentUser}) === undefined ? false : true;
        if(isUserRedakteur || isUserSpeaker || isUserfirstKamera
            || isUsersecondKamera || isUserKameraassistent || isUserTonmann || isUserTonassistent
            || isUserLichttechnik || isUserLichtassistent || isUserCutter === true ) {
            return true;
        }
    },
    //Welche User sind an Produktion beteiligt
    userlist: function() {
        var tmpArray = [];
        var tmpProd = ProdList.findOne({_id: this._id}); //suche Produktion mit dieser ID
        if(tmpProd !== undefined) {
            var einsprecher = tmpProd.einsprecher;
            var redakteur = tmpProd.redakteur;
        }

        var tmpKamera = Events.find({prID: this._id, categorie: 'kamera'}).fetch();
        if(tmpKamera !== undefined) {
            for(i=0; i<tmpKamera.length; i++) {
                var firstKamera = tmpKamera[i].firstKamera;  //finde alle Kameramann 1
                var secondKamera = tmpKamera[i].secondKamera;  //finde alle Kameramann 2
                var kameraAssistent = tmpKamera[i].kameraassistent;  //finde alle Kameraassistenten
                var tonmann = tmpKamera[i].tonmann;  //finde alle Tonmann
                var tonassistent = tmpKamera[i].tonassistent;  //finde alle Tonassistenten
                var lichttechnik = tmpKamera[i].lichttechnik;  //finde alle Lichttechniker
                var lichtassistent = tmpKamera[i].lichtassistent;  //finde alle Lichtassistenten

                tmpArray.push(firstKamera, secondKamera, kameraAssistent, tonmann, tonassistent, lichttechnik, lichtassistent);
            }

        }

        var tmpCutter = Events.find({prID: this._id, categorie: 'schnitt'}).fetch();
        if(tmpCutter !== undefined) {
            for(i=0; i<tmpCutter.length; i++) {
                tmpArray.push(tmpCutter[i].cutter)
            }
        }




        console.log(this._id);
        //console.log('einsprecher: '+einsprecher+' redakteur: '+redakteur+' firstKamera: '+firstKamera+' secondKamera: '+secondKamera+' kameraAssistent: '+kameraAssistent+' tonmann: '+tonmann+' tonassistent: '+tonassistent+' lichttechnik: '+lichttechnik+' lichtassistent: '+lichtassistent);
        var mergedMember = _.union(einsprecher, redakteur, tmpArray);     //füge Arrays zusammen
        //console.log('mergedMember: '+mergedMember);
        var mergedNonDuplicateMember = _.compact(mergedMember); //entferne doppelte Einträge aus Array
        //console.log('mergedNonDuplicateMember: '+mergedNonDuplicateMember);
        return mergedNonDuplicateMember;

    }

    });
// Change Format in Strings
Template.showProduction.helpers({
    countActive: function(){
        var countActivePR = ProdList.find().count();
        return countActivePR;
    }

});
Template.deleteConfirm.helpers({
    prTitle: function() {
        return Session.get('prTitle');
    }
});


// Modal Dialog when clicking show
Template.showProduction.events({
    'click .show_btn': function(event){
        //Modal-Popup
        var data = 'dataexample';
        var options = {backdrop: 'static'};
        Modal.show('detailProduction', data, options);

        var proIdVar = event.target.value;
        var currentProdTitle = ProdList.findOne(proIdVar).title;
        var currentProdThema = ProdList.findOne(proIdVar).thema;
        var currentProdDatum = Events.findOne({prID: proIdVar, categorie: 'production'}).start;
        var currentProdFormat = ProdList.findOne(proIdVar).format.toString();
        Session.set("editTreatment", false);
        console.log("Seite wurde gerenderd, bearbeiten: "+Session.get("editTreatment"));
        console.log("ProductionID: "+proIdVar);

        Session.set("prID", proIdVar);
        Session.set("prTitle", currentProdTitle);
        Session.set("prThema", currentProdThema);
        Session.set("prEnddatum", currentProdDatum);
        Session.set("prFormat", currentProdFormat);
    },
    //Klick auf Entfernen
    'click .remove_btn': function(event){
        var proIdVar = event.target.value;
        Session.set('prTitle', ProdList.findOne(proIdVar).title);

        if(proIdVar.length = 0)
            Bert.alert("Keine ID vorhanden", 'danger');
        else
        {
            $('#confirm-delete').on('show.bs.modal', function(event) {
                //$(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
                $(this).find('.btn-ok').on('click', function (event) {
                    ProdList.remove(proIdVar);
                    var tmpevents = Events.find({prID: proIdVar}).fetch();
                    for(i=0; i<tmpevents.length; i++){
                        Events.remove(tmpevents[i]._id);
                    }

                    Bert.alert("Produktion entfernt!", 'success');
                    $('#confirm-delete').modal('hide');
                })
            });
        }
    },
    'click .title': function(event) {
        $('.accordion')
            .accordion({
                selector: {
                    trigger: '.title'
                }
            });
    }
});
