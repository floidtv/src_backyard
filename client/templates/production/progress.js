Template.progress.events({
    'click #finish': function (event) {
        var prodIDVar = Session.get('prID');

       if (ProdList.findOne(prodIDVar).isComplete === false) {
           ProdList.update(prodIDVar, {
               $set: {
                   isComplete: true
               }
           });
           console.log('Production is set to Complete');
        } else {
           ProdList.update(prodIDVar, {
               $set: {
                   isComplete: false
               }
           });
           console.log('Production is set to Incomplete');
        }
    }
});


Template.progress.helpers({
    //Fortschritt berechnen
    complete: function () {
        var currProd = ProdList.findOne(Session.get('prID'));
        if(currProd !== undefined) {
            if(currProd.redakteur !== undefined){
                var redakteurStatus = currProd.redakteur.length === 0 || undefined ||null || '' ? 0 : 25;
            }
            else
                var redakteurStatus = 0;
            if(currProd.einsprecher !== undefined){
                var speakerStatus = currProd.einsprecher.length === 0 || undefined || null || '' ? 0 : 25;
            }
            else
                var speakerStatus = 0;



            var currKameraEvent = Events.findOne({prID: Session.get('prID'), categorie: 'kamera'});
            if(currKameraEvent !== undefined) {
                var kameraStatus = currKameraEvent.firstKamera === 0 || currKameraEvent.firstKamera === undefined || currKameraEvent.firstKamera === null || currKameraEvent.firstKamera === '' ? 0 : 25;
            }
            else
                var kameraStatus = 0;

            var currCutEvent = Events.findOne({prID: Session.get('prID'), categorie: 'schnitt'});
            if(currCutEvent !== undefined) {
                var cutStatus = currCutEvent.cutter === 0 || currCutEvent.cutter === undefined || currCutEvent.cutter === null || currCutEvent.cutter === '' ? 0 : 25;
            }
            else
                var cutStatus = 0;

            var completeStatus = redakteurStatus + speakerStatus + kameraStatus + cutStatus;
            if(completeStatus === 100){
                var r = 33;
                var g = 186;
                var b = 69;
            }
            else {
                var r = 242;
                var g = 98;
                var b = 2;
            }

            return {r: r, g: g, b: b, status: completeStatus};
        }

    },
    //Button-Farbe je nachdem anzeigen
    isComplete: function () {

        var prodIDVar = ProdList.findOne(Session.get('prID'));
        if(prodIDVar !== undefined){
            if (prodIDVar.isComplete === false) {
                return {text: 'Abschließen' ,color: 'green'};
            }
            else {
                return {text: 'Wiederaufnehmen' ,color: 'red'};
            }
        }

    }
});

