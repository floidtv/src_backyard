Template.intern.helpers({
    formats: function() {
        return Formats.find().fetch();
    }
});

Template.intern.events({
    'click #addFormat': function(event, template){
        event.preventDefault();
        var newFormat = template.find('#newFormat').value;
        if(newFormat != '') {
            var savedFormats = Formats.findOne({name: newFormat});
            if(savedFormats === undefined){
                Formats.insert({_id: Random.id(), name: newFormat});
                Bert.alert('Neues Format "'+newFormat+'" hinzugefügt!', 'success');
                document.querySelector('#newFormat').value='';
            }
            else {
                Bert.alert('Format existiert bereits!', 'danger');
                document.querySelector('#newFormat').value='';
            }
        }
        else {
            Bert.alert('Bitte geben Sie ein Format ein!', 'danger');
        }

    },
    'click #removeFormat': function (event, template) {
        event.preventDefault();
        var selectedFormat = template.find('#formatSelect').value;
        var tmpformat = Formats.findOne({name: selectedFormat});
        Formats.remove(tmpformat._id);
        Bert.alert('Format entfernt!', 'success')
        }

});