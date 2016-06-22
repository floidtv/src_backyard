Template.addProduction.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            horizontal: 'left',
            vertical: 'bottom'
        },
        locale:'de'
    });
});

Template.addProduction.helpers({
    formats: function() {
        return Formats.find().fetch();
    }
});

Template.addProduction.events({
    'submit form': function(event) {
        event.preventDefault();
        var prID = Random.id();
        var prodData = {
            _id: prID,
            title: event.target.prodTitle.value ,
            thema: event.target.prodThema.value,
            format: event.target.prodFormat.value,
            hasTreatment: event.target.hasTreatment.checked,
            hasOfftext: event.target.hasOfftext.checked,
            hasKamera: event.target.hasKamera.checked,
            hasSchnitt: event.target.hasSchnitt.checked,
            oTon: false,
            isComplete: false,
            isRemoved: false,
            isArchieved: false
            //prodDate: {_id: prID, title: event.target.prodTitle.value, allday: true, start: event.target.prodDate.value, color: '#D01919', categorie: 'production'},
            //treatmentDate: {_id: prID, title: 'Treatment '+event.target.prodTitle.value, allday: true, start: '', color: '#F26202', categorie: 'treatment'}
        };

        var eventData = {
            prID: prID,
            title: event.target.prodTitle.value,
            allday: true,
            start: event.target.prodDate.value,
            color: '#D01919',
            categorie: 'production'
        };

        console.log('Die neue ID='+prID+"data="+prodData);

        ProdList.insert(prodData);
        Events.insert(eventData);

        //Clear form
        event.target.prodTitle.value = '';
        event.target.prodThema.value = '';
        event.target.prodFormat.value = '';
        event.target.prodDate.value = '';
        event.target.hasTreatment.checked = true;
        event.target.hasOfftext.checked = true;
        event.target.hasKamera.checked = true;
        event.target.hasSchnitt.checked = true;
    }
});
