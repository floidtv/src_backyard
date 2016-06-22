Template.userDropDown.rendered = function() {
    $('#multi-select')
        .dropdown('restore default text')
    console.log('something happens')
    ;
}
Template.userDropDown.helpers({
    userList: function() {
        return Meteor.users.find().fetch();
    }
});
/* //Backup funktoniert schon fast

Template.userDropDown.events({
    "change #multi-select": function (event){
        event.preventDefault();
        var val = $('#multi-select option:selected').val();
        //var selecteditem = event.target.value;
        select_data.push(val);
        console.log('selectedItem '+select_data)
    }
});
    */
var users = [];
var x = {
    users: ['']
};
//Add new User to Conzept
Template.userDropDown.events({
    'click #addUser': function (ev, template) {
        var taggedUser = $('#multi-select option:selected').val();
        var prID = Session.get('prID')
        var hasValue = ProdList.findOne({_id: prID , konzeptTeilnehmer: taggedUser}) === undefined ? false : true
        if(hasValue == true){
            alert('User already tagged in this Production')
        }
        else {
            ProdList.update(prID, {
                $addToSet: {
                    konzeptTeilnehmer: taggedUser
                }
            });
            alert('User added')
        }
    },
    //Remove User from Conzept
    'click #removeUser': function (ev, template) {
        var taggedUser = $('#multi-select option:selected').val();
        var prID = Session.get('prID')
        var hasValue = ProdList.findOne({_id: prID , konzeptTeilnehmer: taggedUser}) === undefined ? false : true
        if(hasValue == true){
            ProdList.update(prID, {
                $pull: {
                    konzeptTeilnehmer: taggedUser
                }
            });
            alert('User removed')
        }
        else {
            alert('User does not exist in this Production')
        }
    }
});
/*
//Variante mit array
var taggedUserObj = [];
Template.userDropDown.events({
    'click #addUser': function (ev, template) {
        var taggedUser = $('#multi-select option:selected').val();
        var taggedUserCount = taggedUserObj.length

            var l = taggedUserObj.length
            for(var i=0; i<l;i++)
            {
                if(taggedUserObj[i]==taggedUser){
                    console.log('User already tagged')
                    return;
                }
            }
            taggedUserObj.push(taggedUser);




        for (i = 0; i < taggedUserCount+1; i++) {
            console.log('selectedItem '+taggedUserObj[i]+ ' Count: '+ (i+1))
        }

        }

}); */