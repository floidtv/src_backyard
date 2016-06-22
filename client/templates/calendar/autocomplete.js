Template.autocomplete.rendered = function () {
    AutoCompletion.init("input#search");
};

Template.autocomplete.events = {
    'keyup input#search': function () {
        AutoCompletion.autocomplete({
            element: 'input#search',       // DOM identifier for the element
            collection: ProdList,              // MeteorJS collection object
            field: 'title'                    // Document field name to search for
            //limit: 0,                         // Max number of elements to show
            //sort: { name: 1 }
            });              // Sort object to filter results with
        //filter: { 'gender': 'female' }}); // Additional filtering
    },
    'click .submit': function(event, template) {

        var searchContent = template.find('#search').value;
        console.log('form submitted='+searchContent);

        if(searchContent === '') {
            var allsearchDates = Events.find().fetch();
        }
        else {
            var prID = Events.findOne({title: searchContent}).prID;
            var allsearchDates = Events.find({prID: prID}).fetch();
        }

/*
        var productionEventSrc = _.compact(ProdList.find().map((function(result) {return result.prodDate;})));
        var treatmentEventSrc = _.compact(ProdList.find().map((function(result) {return result.treatmentDate;})));
        var tmpSpeakerEvents = ProdList.find().map((function(result) {return result.sprecherTermin;}));
        var collectSpeakerEvents = [];

        for(i=0; i<tmpSpeakerEvents.length; i++)
        {
            collectSpeakerEvents = _.compact(_.uniq(collectSpeakerEvents.concat(tmpSpeakerEvents[i])));
        }

        function findProduction(productionEventSrc) {
            return productionEventSrc.title === searchContent;
        }
        var customProdEvent = productionEventSrc.find(findProduction);

        function findTreatment(treatmentEventSrc) {
            return treatmentEventSrc.title === 'Treatment '+searchContent;
        }
        var customTreatEvent = treatmentEventSrc.find(findTreatment);

        function findOfftext(collectSpeakerEvents) {
            return collectSpeakerEvents.title === 'Offtext '+searchContent;
        }
        var customOfftextEvent = collectSpeakerEvents.filter(findOfftext);

        console.log(customProdEvent);
        console.log(customTreatEvent);
        console.log(customOfftextEvent);


        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar( 'renderEvent', customProdEvent );
        $('#calendar').fullCalendar( 'renderEvent', customTreatEvent );
        $('#calendar').fullCalendar( 'addEventSource', customOfftextEvent );
        $('#calendar').fullCalendar('rerenderEvents');
*/
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar( 'addEventSource', allsearchDates );
        $('#calendar').fullCalendar('rerenderEvents');

    }

};



