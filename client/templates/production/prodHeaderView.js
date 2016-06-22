Template.prodHeaderView.helpers({
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
    }
});

Template.prodHeaderView.events({
    'click .edit': function(event) {
        event.preventDefault();
        Session.set("editProdHeader", true);
        console.log("Session edit true")
    }});