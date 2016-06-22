ProdList = new Meteor.Collection('productions');
Ideas = new Meteor.Collection('ideas');
Comments = new Meteor.Collection('comments');
Events = new Meteor.Collection('events');
Formats = new Meteor.Collection('formats');

if (Meteor.isClient) {
    _ = lodash;
    //--------------------------------------------------------------------------------------------




    //--------------------------------------------------------------------------------------------

    Template.mainlayout.events({
        'click .logout': function(event) {
            event.preventDefault();
            Meteor.logout();
        }
    });
    Meteor.subscribe('productions');
    Meteor.subscribe('ideas');
    Meteor.subscribe('comments');
    Meteor.subscribe('events');
    Meteor.subscribe('users');
    Meteor.subscribe('formats');




}

if (Meteor.isServer) {

    _ = lodash; //Lodash Library einbinden Underscore
//Eingegebenes Offtext Datum mit vorh. Datensätzen vergleichen
    function compareDates(delay, data, callback) {
        var allSpeakerDates = Events.find({categorie: 'speaker'}).fetch();//Finde alle Datensätze in Kategorie 'speaker'
        //console.log('---------------------------------------------------------------------------------');
        if(allSpeakerDates.length == 0){ //wenn vorhandene Offtext Datensätze = 0?
            //neuen Datensatz hinzufügen (ohne Prüfung)
            Meteor.call('insertSpeakerDate', data);
        }
        else {
            var tmpStart = moment(data.start).toDate(); //konvertiere angegebenes Datum in Datumsformat
            var tmpEnd = moment(data.end).toDate();   //konvertiere angegebenes Datum in Datumsformat

            var dateExists;
            for(i=0; i<allSpeakerDates.length; i++) { //durchlaufe alle vorhandenen Datensätze
                var exStart = moment(allSpeakerDates[i].start).toDate(); //konvertiere vorhandenes Datum in Datumsformat
                var exEnd = moment(allSpeakerDates[i].end).toDate();     //konvertiere vorhandenes Datum in Datumsformat
                var exID = allSpeakerDates[i]._id;
                console.log('compare cID:'+data._id+' with exID: '+exID+' '+tmpStart+' with '+exStart+' and '+tmpEnd+' with '+exEnd);

                if (tmpStart > exStart && tmpEnd < exEnd) { //wenn Start > exStart & Ende < exEnde
                    console.log('date compare status 1');
                    dateExists = true;

                }
                else if(tmpStart < exStart && tmpEnd > exStart) { //wenn Start < exStart & Ende > exEnde
                    console.log('date compare status 2');
                    dateExists = true;

                }
                else if(tmpStart < exEnd && tmpEnd > exEnd) { //wenn Start < exStart & Ende > exEnde
                    console.log('date compare status 3');
                    dateExists = true;

                }
                else if(tmpStart < exStart && tmpEnd > exEnd) { //wenn Start < exStart & Ende > exEnde
                    console.log('date compare status 4');
                    dateExists = true;
                }
                else { // ansonsten
                    console.log('date compare status 5');
                    dateExists = false;
                }

                //ID Compare
                var isSameID;
                if(data._id === exID) {
                    isSameID = true;
                }
                else {
                    isSameID = false;
                }

                if(isSameID === true && dateExists === true) {
                    console.log('id compare status 1');
                    Meteor.call('updateSpeakerDate', data); //aktualisieren
                    break;
                }
                else if(isSameID === false && dateExists === true) {
                    console.log('id compare status 2');
                    break;
                    //alert
                }
                else if(isSameID === true && dateExists === false) {
                    console.log('id compare status 3');
                    Meteor.call('updateSpeakerDate', data); //aktualisieren
                    break;
                }
                else if(isSameID === false && dateExists === false) {
                    console.log('id compare status 4');
                    Meteor.call('insertSpeakerDate', data); //hinzufügen
                    break;
                }
                else {
                    console.log('id compare status 5');
                }

            }
            setTimeout(function() { //verzögere Callback Funktion
                callback(null, dateExists);
            }, delay);
        }

    }
    //
    var wrappedCompareDates = Async.wrap(compareDates); //wandle Funktion in synchrone Funktion mit Verzögerung


    Meteor.startup(function () {
        // code to run on server at startup
        Meteor.absoluteUrl.defaultOptions.rootUrl = "http://fm-floidcms-vm.htwk-leipzig.de";
    });



    Meteor.methods({
        //Schnitt-Datum einfügen
        'upsertCutDate': function(data, array){
            for(i=0; i<array.length; i++){
                var dataset = {
                    _id: array[i]._id,
                    cutter: array[i].cutter,
                    prID: data.prID,
                    title: data.title,
                    start: array[i].start,
                    end: array[i].end,
                    schnittraum: array[i].schnittraum,
                    besonderheiten: array[i].besonderheiten,
                    color: data.color,
                    categorie: data.categorie
                };
                //console.log(dataset);
                var callback = Events.upsert(dataset._id,
                    {
                        // Modifier
                        $set: dataset
                    });

            }
            console.log('Schnittdatum inserted');
            return callback;
        },
        //KameraDatum einfügen
        'upsertKameraDate': function(data, array){
            for(i=0; i<array.length; i++){
                var dataset = {
                    _id: array[i]._id,
                    firstKamera: array[i].firstKamera,
                    secondKamera: array[i].secondKamera,
                    kameraassistent: array[i].kameraassistent,
                    tonmann: array[i].tonmann,
                    tonassistent: array[i].tonassistent,
                    lichttechnik: array[i].lichttechnik,
                    lichtassistent: array[i].lichtassistent,
                    prID: data.prID,
                    title: data.title,
                    start: array[i].start,
                    end: array[i].end,
                    drehort: array[i].drehort,
                    besonderheiten: array[i].besonderheiten,
                    color: data.color,
                    categorie: data.categorie
                };
                //console.log(dataset);
                var callback = Events.upsert(dataset._id,
                    {
                        // Modifier
                        $set: dataset
                    });

            }
            console.log('Kameradatum inserted');
            return callback;
        },
        //Speakerdate einfügen
        'insertSpeakerDate': function(data){
            console.log('Speakerdate inserted');
            //console.log('Methode: array='+speakerDateID + " prID="+prodIDVar + " speakerDateStart="+speakerDateStartVar + " speakerDateEnd="+speakerDateEndVar);
            Events.insert({
                _id: data._id,
                prID: data.prID,
                title: data.title,
                start: data.start,
                end: data.end,
                color: '#009C95',
                categorie: 'speaker',
                flagged: false
            });
        },
        //SpeakerDate aktualisieren
        'updateSpeakerDate': function(data) {
            console.log('Speakerdate updated: '+data._id);
            Events.update({_id: data._id}, {
                $set: {
                    title: data.title,
                    start: data.start,
                    end: data.end
                }
            });
        },
        //Speakerdate-Vergleich verzögern
        'delayedDateCompare': function(data) {
            var response = wrappedCompareDates(1000, data); //verzögere Funktion um 0,5 Sek
            return response;
        },
        //Treatment Fertigstellung Termin erstellen/ändern
        'updateTreatmentDate': function(prodIDVar, prodTitleVar, treatmentDateVar){
            console.log("prID="+prodIDVar + " treatmentTitle="+prodTitleVar+" treatmentDate="+treatmentDateVar);

            var currEvent = Events.findOne({prID: prodIDVar, categorie: 'treatment'});

            if(currEvent === undefined){
                console.log('treatmentDate inserted');
                Events.insert({
                    prID: prodIDVar,
                    title: 'Treatment: '+prodTitleVar,
                    start: treatmentDateVar,
                    color: '#F26202',
                    categorie: 'treatment'
                });
            }
            else {
                console.log('treatmentDate updated');
                Events.update({_id: currEvent._id}, {
                    $set: {
                        title: 'Treatment: '+prodTitleVar,
                        start: treatmentDateVar
                    }
                });
            }
        },
       //EditUserRoles
        editUserRole: function(currentUser, editUserID){
            if(Roles.userIsInRole(currentUser._id, 'Admin')){
                if(Roles.userIsInRole(editUserID, 'Admin'))
                {
                    Roles.setUserRoles(editUserID, 'CampusRecords');
                }
                else if(Roles.userIsInRole(editUserID, 'Redakteur')) {
                    Roles.setUserRoles(editUserID, 'Admin');
                }
                else if(Roles.userIsInRole(editUserID, 'Member')) {
                    Roles.setUserRoles(editUserID, 'Redakteur');
                }
                else if(Roles.userIsInRole(editUserID, 'CampusRecords')) {
                    Roles.setUserRoles(editUserID, 'Member');
                }
            }
        },

        /*
        //Termin hinzufügen Methode
        addEvent: function (eventTitleVar, eventStart) {
            Events.insert({'_id': Session.get('currProdID'), 'title': eventTitleVar, 'start': eventStart, 'allDay': true, 'color': 'red'});
            return result;
        },
        */




        //Create new user method
    createUserAndRole: function(userdata){
        console.log('server-sided-register: '+ userdata[0].email);
            var id = Accounts.createUser({
                    email: userdata[0].email,
                    password: userdata[0].password,
                    profile: {
                        firstname: userdata[0].firstname,
                        lastname: userdata[0].lastname,
                        shortcode: userdata[0].shortcode
                    }
            });
            console.log('Account wurde erstellt. Der Administrator muss das Konto nun freigeben');
            if (userdata[0].roles.length > 0) {
                Roles.addUsersToRoles(id, userdata[0].roles);
            }
        return id;
        },
        //Check email is unverified
        sendVerificationLink: function(userId) {
            //var userId = Meteor.userId();
            console.log(userId);
            if(userId) {
                return Accounts.sendVerificationEmail(userId);
            }
        },
        //Check email is unverified
        checkEmailVerification: function(email) {
            found_user = Meteor.users.findOne({ 'emails.address' : email })
            if(found_user){
                if(found_user.emails[0].verified == true){
                    return "verified";
                }else{
                    return "unverified";
                }
            }else{
                return "notfound";
            }
        }
    });

    //--------------------------------------------------------------------------------------------
    //Create Admin Account
    if(Meteor.users.find().count() === 0){
        var users = [{firstname:"Admin",lastname: "Admin", email: "admin@floid.tv", roles:['Admin'], shortcode: 'AdA'}];

        _.each(users, function (user) {
            var id;

            id = Accounts.createUser({
                email: user.email,
                password: "776567",
                profile: { firstname: user.firstname,
                            lastname: user.lastname,
                            shortcode: user.shortcode}
            });

            if (user.roles.length > 0) {
                Roles.addUsersToRoles(id, user.roles);
            }

        });
    }
    ProdList.allow({
        insert: function () {
            return true;
        },

        remove: function (){
            return true;
        },

        update: function() {
            return true;
        }

    });

    Ideas.allow({
        insert: function () {
            return true;
        },

        remove: function (){
            return true;
        },

        update: function() {
            return true;
        }

    });

    Events.allow({
        insert: function () {
            return true;
        },

        remove: function (){
            return true;
        },

        update: function() {
            return true;
        }
    });
    Formats.allow({
        insert: function () {
            return true;
        },

        remove: function (){
            return true;
        },

        update: function() {
            return true;
        }
    });
    Comments.allow({
        insert: function () {
            return true;
        },

        remove: function (){
            return true;
        },

        update: function() {
            return true;
        }
    });

    //Allow Admins to remove and update users
    Meteor.users.allow({
        remove: function (userId, doc) {
            var currentUser, userRole;
            currentUser = Meteor.users.findOne({ _id: userId }, { fields: { roles: 1 } });
            console.log("currentuser " +currentUser._id);
            userRole = Meteor.users.findOne({_id: userId}).roles[0];
            console.log("userRole " +userRole);
            if (userRole === "Admin" && userId !== doc._id) {
                console.log("Access granted to remove user from database");
                return true;
            } else {
                console.log("Access denied to remove user from database");
                return false;
            }
        },
        fetch: [],
        //update
        update: function (userId, doc) {
            var userRole;
            userRole = Meteor.users.findOne({_id: userId}).roles[0];
            if (userRole === "Admin" && userId !== doc._id) {
                console.log("Access granted to verify user from database");
                return true;
            } else {
                console.log("Access denied to verify user from database");
                return false;
            }
        },
        fetch: []
    });



    Meteor.publish('productions', function(){
        return ProdList.find();
    });
    Meteor.publish('users', function(){
        return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1}});
    });
    Meteor.publish('ideas', function(){
        return Ideas.find();
    });
    Meteor.publish('events', function(){
        return Events.find();
    });
    Meteor.publish('formats', function(){
        return Formats.find();
    });
    Meteor.publish('comments', function(){
        return Comments.find();
    });

}