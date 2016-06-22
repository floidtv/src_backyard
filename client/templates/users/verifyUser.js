//Button Click event on Remove User Button
Template.listUsers.events({
    'click .verify_user_btn': function(event){
        var userIdVar = event.target.value;
        var loggedInUser = Meteor.user()
        if(loggedInUser.roles == 'Admin') {
            if (Meteor.users.findOne(userIdVar).emails[0].verified == false) {
                Meteor.users.update(userIdVar, {
                    $set: {
                        "emails.0.verified": true
                    }
                });

                console.log("User verified");
            }
            else {
                Meteor.users.update(userIdVar, {
                    $set: {
                        "emails.0.verified": false
                    }
                });
            }
        }
        //alert("Keine Benutzer-ID vorhanden");
        else
        {
            console.log("User is not Admin");
            //alert("Benutzer gelöscht");
        }
        }
});