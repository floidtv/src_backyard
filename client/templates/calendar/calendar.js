Template.calendar.events({
    'click .dropdown': function(event) {
        $('.accordion')
            .accordion({
                selector: {
                    trigger: '.dropdown'
                }
            });
    },
    'submit form': function(event) {
        event.preventDefault();
        var eventTitleVar = event.target.eventName.value;
        var eventDateVar = event.target.eventDate.value;
        var eventDescriptionVar = event.target.eventDescription.value;

        //var newEventDate = moment(eventDateVar);
        var isDateValid = moment(eventDateVar).isValid();
        var eventAuthorVar = Meteor.users.findOne(Meteor.user()._id).profile.shortcode;
        /*var eventCreatedAtVar = moment({
         format: 'L LT',
         locale: 'de'
         })*/

        console.log(eventTitleVar +" "+ eventDateVar +" "+
            eventAuthorVar +" "+
            eventDescriptionVar+" isDateValid="+isDateValid);
        var myEvent = {
            _id: Random.id(),
            title: eventTitleVar ,
            description: eventDescriptionVar,
            allDay: false,
            start: eventDateVar,
            color: '#16AB39',
            categorie: 'other',
            author: eventAuthorVar

        };
        Events.insert(myEvent);

        $('#calendar').fullCalendar( 'renderEvent', myEvent ); //aktuelles Event direkt laden
        $('#calendar').fullCalendar('rerenderEvents');
        //Clear form
        event.target.eventName.value = '';
        event.target.eventDate.value = '';
        eraseDescription();
    },
    'click .remove': function(event) {
        event.preventDefault();

        var eventID = Session.get('eventID');

        console.log('remove click eventID='+eventID);
        Events.remove(eventID);
        calendarRefresh([true, true, true, true, true]);
    }

});

Template.calendar.onRendered(function() {
    //neue Events
    var otherEvents = Events.find({categorie:'other'}).fetch();
    var treatmentEvents = Events.find({categorie:'treatment'}).fetch();
    var productionEvents = Events.find({categorie:'production'}).fetch();
    var kameraEvents = Events.find({categorie:'kamera'}).fetch();
    var speakerEvents = Events.find({categorie:'speaker'}).fetch();
    var cutEvents = Events.find({categorie:'schnitt'}).fetch();
    var ideaEvents = Ideas.find().fetch();
    /*
    var otherEvents = Events.find().fetch();
    //Events aus Produktionen
    var prodEvents = function(start, end, timezone, callback) {
        callback(_.compact(ProdList.find().map( function(result) { return result.prodDate; } )))};
    //Events aus Treatments
    var treatmentEvents = function(start, end, timezone, callback) {
        callback(_.compact(ProdList.find().map( function(result) { return result.treatmentDate; } )))};
    //Events aus Sprecher


    var tmpSpeakerEvents = ProdList.find().map((function(result) {return result.sprecherTermin;}));
    var collectSpeakerEvents = [];

    for(i=0; i<tmpSpeakerEvents.length; i++)
    {
        collectSpeakerEvents = _.compact(_.uniq(collectSpeakerEvents.concat(tmpSpeakerEvents[i])));
    }
    console.log(collectSpeakerEvents);

var speakerEvents = function(start, end, timezone, callback) {
    callback(collectSpeakerEvents)};
     */

    //Mini-Kalender bei Termin anlegen
    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        widgetPositioning: {
            horizontal: 'left',
            vertical: 'bottom'
        },
        locale: 'de'
    });
    //Großer Kalender
    $(document).ready(function () {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'today'
        },
        lang: 'de',
        defaultView: 'month',
        editable: false,

        //Events einfügen
        eventSources: [
                    productionEvents,
                    kameraEvents,
                    treatmentEvents,
                    speakerEvents,
                    cutEvents,
                    otherEvents,
                    ideaEvents
                    ],

        defaultDate: moment().format("YYYY-MM-DD HH:mm"),

        //Bei Klick auf einen Termin, Daten übergeben und Popup öffnen
        eventRender: function (event, element) {
            element.attr('href', 'javascript:void(0);');
            element.click(function () {
                console.log('eventID = '+event.prID);
                var prod = ProdList.findOne(event.prID);
                var output,tempProd;
                if(event.categorie === 'treatment'){
                    $('#modal-members').html(prod.redakteur.toString());
                    $('#modal-description').html(prod.idea);
                }
                else if(event.categorie === 'production'){
                    $('#modal-description').html(prod.thema);
                }
                else if(event.categorie === 'speaker'){
                    $('#modal-members').html(prod.einsprecher.toString());
                    $('#modal-description').html(prod.offtext);
                }
                else if(event.categorie === 'schnitt'){
                    var tmpevent = Events.findOne(event._id);
                    $('#modal-members').html(tmpevent.cutter.toString());
                    $('#modal-description').html(tmpevent.schnittraum);
                }
                else if(event.categorie === 'kamera'){
                    var tmpevent = Events.findOne(event._id);
                    $('#modal-members').html(tmpevent.firstKamera.toString());
                    $('#modal-description').html(tmpevent.drehort);
                }
                else if(event.categorie === 'other'){
                    var tmpevent = Events.findOne(event._id);
                    $('#modal-members').html(tmpevent.author);
                    $('#modal-description').html(tmpevent.description);
                }
                else {
                    $('#modal-members').html('');
                    $('#modal-description').html('');
                }

                var newDate = moment(event.start).format('YYYY-MM-DD HH:mm'); //Datum umwandeln in richtiges Format
                console.log('currID='+event._id+ ' title='+event.title+ ' datum='+event.start+ ' neudatum='+moment(event.start).format('YYYY-MM-DD HH:mm')+ ' desc='+event.description)

                $('#modal-title').html(event.title);
                $('#modal-start').html(newDate);

                Session.set('eventID', event._id)

                $('#eventModal').modal('show');
                });
            }
        });
        var filterArray = [true, true, true, true, true];

        //wenn Checkbox productionCheck Change
        $(".filterCheck").change(function () {
            if($(this).prop('checked')) {
                index = $(this).attr('data-value');
                filterArray[index] = true;
                console.log(index+'=checked');
                //calendarRefresh(collectSpeakerEvents, filterArray);
                calendarRefresh(filterArray);
            }
            else {
                index = $(this).attr('data-value');
                filterArray[index] = false;
                console.log(index+'=un-checked');
                //calendarRefresh(collectSpeakerEvents, filterArray);
                calendarRefresh(filterArray);
            }

        });

        //Bei Klick auf Vor/Zurück Button Termine neu laden
        $('body').on('click', 'button.fc-prev-button', function() {
            //calendarRefresh(collectSpeakerEvents, filterArray);
            //calendarRefresh(filterArray);

        });

        $('body').on('click', 'button.fc-next-button', function() {
            //calendarRefresh(collectSpeakerEvents, filterArray);
           // calendarRefresh(filterArray);
        });

    });
});


Template.calendar.helpers({

    event: function () {
        return ProdList.findOne(Session.get('eventID'));
    },
    categorieIsOther: function(){
        var eventID = Session.get('eventID');
        var event = Events.findOne(eventID);
        if(event != undefined) {
            if(event.categorie === 'other')
                return true;
            else
                return false;

        }
    },
    titleDescription: function(){
        var eventID = Session.get('eventID');
        var event = Events.findOne(eventID);
        if(event != undefined) {
            switch (event.categorie) {
                case 'other':
                    return 'Beschreibung';
                case 'speaker':
                    return 'Offtext';
                case 'schnitt':
                    return 'Raum';
                case 'production':
                    return 'Thema';
                case 'treatment':
                    return 'Idee';
                case 'kamera':
                    return 'Treffpunkt';
            }
        }
    }

});



//eigene Methoden
//Inhalt aus Textbox entfernen bei Terin anlegen
function eraseDescription()
{
    $("#eventDescription").val("");
}
function calendarRefresh(filterArray)
//function calendarRefresh(collectSpeakerEvents, filterArray)
{
    //Neue Eventsources
    var otherEventSrc = Events.find({categorie:'other'}).fetch();
    var treatmentEventSrc = Events.find({categorie:'treatment'}).fetch();
    var productionEventSrc = Events.find({categorie:'production'}).fetch();
    var kameraEventsSrc = Events.find({categorie:'kamera'}).fetch();
    var speakerEventSrc = Events.find({categorie:'speaker'}).fetch();
    var cutEventsSrc = Events.find({categorie:'schnitt'}).fetch();
    var ideaEventsSrc = Ideas.find().fetch();
    /*
    var productionEventSrc = _.compact(ProdList.find().map((function(result) {return result.prodDate;})));
    var treatmentEventSrc = _.compact(ProdList.find().map((function(result) {return result.treatmentDate;})));
    var speakerEvents = function(start, end, timezone, callback) {callback(collectSpeakerEvents)};
    var otherEventsSrc = Events.find().fetch();
    */
    $('#calendar').fullCalendar('removeEvents');
    if(filterArray[0] === true)
    {
        $('#calendar').fullCalendar('addEventSource', productionEventSrc);
    }
    if(filterArray[1] === true)
    {
        $('#calendar').fullCalendar('addEventSource', treatmentEventSrc);
    }
    if(filterArray[2] === true)
    {
        $('#calendar').fullCalendar('addEventSource', speakerEventSrc);
    }
    if(filterArray[3] === true)
    {
        $('#calendar').fullCalendar('addEventSource', kameraEventsSrc);
    }
    if(filterArray[4] === true)
    {
        $('#calendar').fullCalendar('addEventSource', cutEventsSrc);
    }

    $('#calendar').fullCalendar('addEventSource', otherEventSrc);
    $('#calendar').fullCalendar('addEventSource', ideaEventsSrc);
    $('#calendar').fullCalendar('rerenderEvents');
}








