
Template.detailProduction.helpers({



    treatmentIsInEdit: function() {
        return Session.equals('editTreatment', true)
    },
    kameraIsInEdit: function() {
        return Session.equals('editKamera', true)
    },
    cutIsInEdit: function() {
        return Session.equals('editCut', true)
    },
    audioIsInEdit: function() {
        return Session.equals('editAudio', true)
    },

    hasTreatment: function () {
        var isTreatmentChecked = ProdList.findOne(Session.get('prID'));
        if(isTreatmentChecked !== undefined){
            if(isTreatmentChecked.hasTreatment === true)
                return true;
            else
                return false;
        }
        else
            return false;

    },
    hasOfftext: function () {
        var isOfftextChecked = ProdList.findOne(Session.get('prID'));
        if(isOfftextChecked !== undefined){
            if(isOfftextChecked.hasOfftext === true)
                return true;
            else
                return false;
        }
    },
    hasKamera: function () {
        var isKameraChecked = ProdList.findOne(Session.get('prID'));
        if(isKameraChecked !== undefined){
            if(isKameraChecked.hasKamera === true)
                return true;
            else
                return false;
        }
    },
    hasSchnitt: function () {
        var isSchnittChecked = ProdList.findOne(Session.get('prID'));
        if(isSchnittChecked !== undefined){
            if(isSchnittChecked.hasSchnitt === true)
                return true;
            else
                return false;
        }
    },
    hasOton: function () {
        var isOtonChecked = ProdList.findOne(Session.get('prID'));
        if(isOtonChecked !== undefined){
            if(isOtonChecked.oTon === true)
                return true;
            else
                return false;
        }
    },
    prodHeaderIsInEdit: function() {
        return Session.equals('editProdHeader', true)
}
});

Template.detailProduction.events({
    'hide.bs.modal #prodModal': function(e) {
        Session.set("editTreatment", false);
        Session.set("editKamera", false);
        Session.set("editCut", false);
        Session.set("editAudio", false);
        Session.set('editProdHeader', false);
        kameraDateArray = [];
        Session.set('kameraDateArray', kameraDateArray);

        console.log('modal hide');
    },
    'click #close': function(event) {
        var data = 'dataexample';
        var options = {backdrop: 'static'};
        Modal.hide('detailProduction', data, options);
    },
    'click #download': function(event, template) {
        demoFromHTML2();
        console.log('klick PDF')
    },
});


function demoFromHTML2() {
    var prodContent = ProdList.findOne(Session.get('prID'));
    var kameraEvents = Events.find({prID: Session.get('prID'), categorie: 'kamera'}).fetch();
    var speakerEvents = Events.find({prID: Session.get('prID'), categorie: 'speaker'}).fetch();
    var cutEvents = Events.find({prID: Session.get('prID'), categorie: 'schnitt'}).fetch();
    var imgData = 'data:image/png;base64,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'

    var doc = new jsPDF('p', 'pt', 'a4');

    doc.setFont("helvetica", "bold");


    doc.addImage(imgData, 'png', 450, 50, 64, 18);
    doc.text(40, 60, 'Zusammenfassung');
    doc.line(40, 70, 522, 70);

    doc.setFontSize(12);
    //Linke Spalte Überschriften
    doc.text(40, 100, 'Titel:');
    doc.text(40, 140, 'Thema:');
    doc.text(40, 180, 'Idee:');
    doc.text(40, 220, 'Offtext:');
    doc.text(40, 340, 'Exposè von:');

    //doc.text(40, 420, '2. Offtext-Termin:');
    doc.text(40, 580, 'Internetlinks:');
    doc.text(40, 620, 'O-Ton:');
    doc.text(40, 660, 'Interviewpartner:');
    doc.text(40, 700, 'Kontaktdaten:');
    doc.text(40, 740, 'Fragen:');

    //Rechte Spalte Überschriften
    doc.text(310, 100, 'Ausstrahlung am: ');
    doc.text(310, 140, 'Format:');
    doc.text(310, 220, 'Bilder:');
    doc.text(310, 340, 'Sprecher:');
    doc.text(310, 660, 'Funktion:');


    //Content Page 1
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    //Linke Spalte
    if(prodContent.title == null || undefined)
        doc.text(90, 100, '');
    else
        doc.text(90, 100, prodContent.title);
    if(prodContent.thema == null || undefined)
        doc.text(90, 140, '');
    else
        doc.text(90, 140, prodContent.thema);
    if(prodContent.idea == null || undefined)
        doc.text(40, 200, '');
    else
        doc.text(40, 200, prodContent.idea);
    if(prodContent.offtext == null || undefined)
        doc.text(40, 240, '');
    else
        doc.text(40, 240, prodContent.offtext);
    if(prodContent.redakteur == null || undefined)
        doc.text(150, 340, '');
    else
        doc.text(150, 340, prodContent.redakteur);

    var y=380;
    for(i=0;i<speakerEvents.length;i++){
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(40, y, i+1+'. Offtext-Termin:');
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(150, y, speakerEvents[i].start+ ' Uhr bis '+speakerEvents[i].end+' Uhr');
        y=y+40;
    }
    //doc.text(150, 380, '1. Offtext-Termin:');
    //doc.text(150, 420, '2. Offtext-Termin:');
    if(prodContent.hyperlinks == null || undefined)
        doc.text(150, 580, '');
    else
        doc.text(150, 580, prodContent.hyperlinks);

    if(prodContent.oTon == null || undefined || false)
        doc.text(150, 620, 'nein');
    else
        doc.text(150, 620, 'ja');

    if(prodContent.iPartner == null || undefined)
        doc.text(150, 660, '');
    else
        doc.text(150, 660, prodContent.iPartner);

    if(prodContent.ipKontakt == null || undefined)
        doc.text(150, 700, '');
    else
        doc.text(150, 700, prodContent.ipKontakt);

    if(prodContent.fragen == null || undefined)
        doc.text(40, 760, '');
    else
        doc.text(40, 760, prodContent.fragen);



    //Rechte Spalte Überschriften
    doc.text(420, 100, 'Ausstrahlung am: ');

    if(prodContent.format == null || undefined)
        doc.text(370, 140, '');
    else
        doc.text(370, 140, prodContent.format);

    if(prodContent.bildertext == null || undefined)
        doc.text(310, 240, '');
    else
        doc.text(310, 240, prodContent.bildertext);

    if(prodContent.einsprecher == null || undefined)
        doc.text(370, 340, '');
    else
        doc.text(370, 340, prodContent.einsprecher);

    if(prodContent.ipFunktion == null || undefined)
        doc.text(370, 660, '');
    else
        doc.text(370, 660, prodContent.ipFunktion);







    //Content Page 2
    var x = 40, y = 100;
    for(i=0; i<kameraEvents.length; i++) {

        if(i == 0 || i == 2 || i==4 || i==6 || i==8)
        {
            doc.addPage();
            doc.addImage(imgData, 'png', 450, 50, 64, 18);
        }
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(229, 113, 28);
        //Linke Spalte Überschriften

        doc.text(x, y, i+1+'. Drehtag');
        doc.setTextColor(0, 0, 0);
        doc.text(x, y+40, 'Treffpunkt:');
        doc.text(x, y+80, 'Start: ');
        doc.text(x, y+120, 'Kameramann 1: ');
        doc.text(x, y+160, 'Kamera-Assistent: ');
        doc.text(x, y+200, 'Tonmann/-frau: ');
        doc.text(x, y+240, 'Lichttechnik: ');
        doc.text(x, y+280, 'Besonderheiten: ');

        //Rechte Spalte Überschriften
        doc.text(x+270, y+80, 'Ende:');
        doc.text(x+270, y+120, 'Kameramann 2: ');
        doc.text(x+270, y+200, 'Ton-Assistent: ');
        doc.text(x+270, y+240, 'Licht-Assistent: ');

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        x = x+110;
        if(kameraEvents[i].drehort == null || undefined)
            doc.text(x, y+40, '');
        else
            doc.text(x, y+40, kameraEvents[i].drehort );
        if(kameraEvents[i].start == null || undefined)
            doc.text(x, y+80, '');
        else
            doc.text(x, y+80, kameraEvents[i].start+' Uhr');
        if(kameraEvents[i].firstKamera == null || undefined)
            doc.text(x, y+120, '');
        else
            doc.text(x, y+120, kameraEvents[i].firstKamera);
        if(kameraEvents[i].kameraassistent == null || undefined)
            doc.text(x, y+160, '');
        else
            doc.text(x, y+160, kameraEvents[i].kameraassistent);
        if(kameraEvents[i].tonmann == null || undefined)
            doc.text(x, y+200, '');
        else
            doc.text(x, y+200, kameraEvents[i].tonmann);
        if(kameraEvents[i].lichttechnik == null || undefined)
            doc.text(x, y+240, '');
        else
            doc.text(x, y+240, kameraEvents[i].lichttechnik);
        if(kameraEvents[i].besonderheiten == null || undefined)
            doc.text(x, y+280, '');
        else
            doc.text(x, y+280, kameraEvents[i].besonderheiten);

        x=x+260;
        //Rechte Spalte Überschriften
        if(kameraEvents[i].end == null || undefined)
            doc.text(x, y+80, '');
        else
            doc.text(x, y+80, kameraEvents[i].end+' Uhr');
        if(kameraEvents[i].secondKamera == null || undefined)
            doc.text(x, y+120, '');
        else
            doc.text(x, y+120, kameraEvents[i].secondKamera);
        if(kameraEvents[i].tonassistent == null || undefined)
            doc.text(x, y+200, '');
        else
            doc.text(x, y+200, kameraEvents[i].tonassistent);
        if(kameraEvents[i].lichtassistent == null || undefined)
            doc.text(x, y+240, '');
        else
            doc.text(x, y+240, kameraEvents[i].lichtassistent);

        doc.line(40, y+300, 522, y+300);
        x=40;
        y=440;

    }



    doc.addPage();
    doc.addImage(imgData, 'png', 450, 50, 64, 18);
    var x = 40, y =100;
    for(i=0;i<cutEvents.length;i++){
        if(i == 3)
        {
            doc.addPage();
            doc.addImage(imgData, 'png', 450, 50, 64, 18);
        }
        x = 40;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(x, y, i+1+'. Schnitt-Termin');
        doc.text(x, y+40, 'Schnittraum:');
        doc.text(x, y+80, 'Start: ');
        doc.text(x, y+120, 'Besonderheiten:');

        x=x+110
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        if(cutEvents[i].schnittraum == null || undefined)
            doc.text(x, y+40, '');
        else
            doc.text(x, y+40, cutEvents[i].schnittraum);
        if(cutEvents[i].start == null || undefined)
            doc.text(x, y+80, '');
        else
            doc.text(x, y+80, cutEvents[i].start+' Uhr');
        if(cutEvents[i].besonderheiten == null || undefined)
            doc.text(x, y+120, '');
        else
            doc.text(x, y+120, cutEvents[i].besonderheiten);
        x=x+160
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(x, y+40, 'Cutter:');
        doc.text(x, y+80, 'Ende:');
        x=x+100
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        if(cutEvents[i].cutter == null || undefined)
            doc.text(x, y+40, '');
        else
            doc.text(x, y+40, cutEvents[i].cutter);
        if(cutEvents[i].end == null || undefined)
            doc.text(x, y+80, '');
        else
            doc.text(x, y+80, cutEvents[i].end+' Uhr');

        doc.line(40, y+140, 522, y+140);
        y=y+180;
    }
    //Linke Spalte Überschriften
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(40, y+20, 'Audio');
    doc.text(40, y+60, 'Campus-Records Mitarbeiter:');
    doc.text(40, y+100, 'Besonderheiten:');
    x=40;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    //Rechte Spalte Überschriften
    if(prodContent.audioUser == null || undefined)
        doc.text(x+170, y+60, '');
    else
        doc.text(x+170, y+60, prodContent.audioUser);
    if(prodContent.audioBesonderheiten == null || undefined)
        doc.text(x, y+120, '');
    else
        doc.text(x, y+120, prodContent.audioBesonderheiten);

    doc.save('report_'+prodContent.title+'_'+moment().format('YYYY-MM-DD')+'.pdf');
}




