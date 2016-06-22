Template.prodHeaderEdit.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            horizontal: 'left',
            vertical: 'bottom'
        },
        locale:'de'
    });
});

Template.prodHeaderEdit.helpers({
    prTitle: function () {
        return Session.get("prTitle");
    },
    prThema: function () {
        return Session.get("prThema");
    },
    prEnddatum: function () {
        return Session.get("prEnddatum");
    },
    prFormat: function(){
        return Session.get('prFormat')
    },
    prDate: function() {
        return Session.get('prEnddatum')
    },
    formats: function() {
        return Formats.find().fetch();
    }
});

Template.prodHeaderEdit.events({
    'submit form': function(event) {
        //setze Bearbeiten-Status auf nicht bearbeiten (0)

        event.preventDefault();
        var prodTitleVar = event.target.prodTitle.value;
        var prodThemaVar = event.target.prodThema.value;
        var prodFormatVar = event.target.prodFormat.value;
        var prodDateVar = event.target.prodDate.value;
        var hasTreatmentVar = event.target.hasTreatment.checked;
        var hasOfftextVar = event.target.hasOfftext.checked;
        var hasKameraVar = event.target.hasKamera.checked;
        var hasSchnittVar = event.target.hasSchnitt.checked;

        var prodIDVar = Session.get('prID')
        ProdList.update(prodIDVar, {
            $set: {
                title: prodTitleVar,
                thema: prodThemaVar,
                format: prodFormatVar,
                //prodDate: {title: prodTitleVar, start: prodDateVar, color: 'red'},
                hasTreatment: hasTreatmentVar,
                hasOfftext: hasOfftextVar,
                hasKamera: hasKameraVar,
                hasSchnitt: hasSchnittVar
            }
        });
        var currEvent = Events.findOne({prID: prodIDVar, categorie: 'production'});
        Events.update({_id: currEvent._id}, {
        $set: {
            title: prodTitleVar,
            start: prodDateVar
        }
        });
        console.log('ID='+prodIDVar +" title="+prodTitleVar+ " start="+prodDateVar);

        Session.set("prTitle", prodTitleVar);
        Session.set("prThema", prodThemaVar);
            if (prodFormatVar ==2)
            {
                prodFormatVar = 'intern';
            }
            else if (prodFormatVar ==1)
            {
                prodFormatVar = 'extern';
            }
            else
            {
                prodFormatVar = 'CampusCompact';
            }

        Session.set("prFormat", prodFormatVar);
        Session.set("prEnddatum", prodDateVar);
        Session.set("editProdHeader", false);
    }
});

Template.prodHeaderEdit.helpers({
    internSelected: function () {
        return (Session.get('prFormat') === 'intern') ? 'selected' : '';
    },
    externSelected: function () {
        return (Session.get('prFormat') === 'extern') ? 'selected' : '';
    },
    CampusCompactSelected: function () {
        return (Session.get('prFormat') === 'CampusCompact') ? 'selected' : '';
    },
    hasTreatment: function () {
        var isTreatmentChecked = ProdList.findOne(Session.get('prID')).hasTreatment;
        if(isTreatmentChecked !== undefined){
            if(isTreatmentChecked === true)
                return 'checked';
            else
                return '';
        }
    },
    hasOfftext: function () {
        var isOfftextChecked = ProdList.findOne(Session.get('prID')).hasOfftext;
        if(isOfftextChecked !== undefined){
            if(isOfftextChecked === true)
                return 'checked';
            else
                return '';
        }
    },
    hasKamera: function () {
        var isKameraChecked = ProdList.findOne(Session.get('prID')).hasKamera;
        if(isKameraChecked !== undefined){
            if(isKameraChecked === true)
                return 'checked';
            else
                return '';
        }
    },
    hasSchnitt: function () {
        var isSchnittChecked = ProdList.findOne(Session.get('prID')).hasSchnitt;
        if(isSchnittChecked !== undefined){
            if(isSchnittChecked === true)
                return 'checked';
            else
                return '';
        }
    }
});