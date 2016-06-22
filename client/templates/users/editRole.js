//Button Click event on editRole
Template.listUsers.events({
    'click .editRole_btn': function(event){
        var userIdVar = event.target.value;
        var loggedInUser = Meteor.user()

        Meteor.call('editUserRole', loggedInUser, userIdVar);
    }
});