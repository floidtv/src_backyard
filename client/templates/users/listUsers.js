Template.listUsers.helpers({

    user: function(){
        return Meteor.users.find().fetch();
    }
});
Template.listUsers.helpers({

    userID: function(){
        return this._id;
    }
});
Template.listUsers.helpers({

    userEmail: function(){
        return this.emails[0].address;
    }
});
Template.listUsers.helpers({

    userFname: function(){
        return this.profile.firstname;
    }
});
Template.listUsers.helpers({

    userLname: function(){
        return this.profile.lastname;
    }
});
Template.listUsers.helpers({

    usertype: function(){
        return this.roles[0];
    }
});
Template.listUsers.helpers({

    verified: function(){
        if (this.emails[0].verified == true){
            return "zugelassen";
        }
        else
        {
            return "nicht verifiziert"
        }

    }
});



