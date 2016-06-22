//Button Click event on Remove User Button
Template.listUsers.events({
    'click .remove_user_btn': function(event){
        var userIdVar = event.target.value;
        var loggedInUser = Meteor.user()
        if(loggedInUser.roles == 'Admin') {
            console.log("User is Admin");
            Meteor.users.remove(userIdVar);
            alert("Benutzer gelöscht");
            console.log("User removed");
        }
            //alert("Keine Benutzer-ID vorhanden");
        else
        {
            console.log("User is not Admin");
            //alert("Benutzer gelöscht");
        }

    }
});