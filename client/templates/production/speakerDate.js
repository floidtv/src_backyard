

Template.speakerDate.onRendered(function(event, template){
    var minDate = moment();
    minDate = minDate.subtract(1, "days");
    minDate = minDate.format('YYYY-MM-DD HH:mm');
    this.$('.speakerDatetimepicker').datetimepicker({
        //altes Format format: 'L',
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

Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});

Template.speakerDate.events({
    'click .removeSpeakerDate': function(event) {
        event.preventDefault();
        var prID = Session.get("prID");

        var currSpeakerID = event.target.value;
        var index = speakerDateIDs.indexOf(currSpeakerID); //suche index im array mit ID=currentSpeakerID
        //console.log('ID='+currSpeakerID+' index='+index);
        speakerDateIDs.splice(index, 1); //lösche Element aus Array
        speakerDateArray.splice(index, 1);
        Session.set('speakerDateArray',speakerDateArray);

        Events.remove(currSpeakerID);
    }
});




Template.speakerDate.helpers({
    color: function (id) {
        var flaggedIDs = Session.get('speakerDateArray');
        //console.log(flaggedIDs.length);
        for(i=0; i<flaggedIDs.length; i++) {

            console.log(flaggedIDs[i]._id+'cID: '+id);
            if(flaggedIDs[i]._id === id && flaggedIDs[i].flagged === true)
            {
                return 'red';
            }
            else if(flaggedIDs[i]._id === id && flaggedIDs[i].flagged === false)
            {
                return 'green';
            }
        }
    }
    });






