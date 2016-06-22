Template.ideas.events({
    'submit .idea': function(event, template) {
        event.preventDefault();
        var ideaTitle = event.target.ideaTitle.value;
        var ideaDate = event.target.ideaDate.value;
        var ideaDescription = event.target.ideaDescription.value;
        var ideaOwnerID = Meteor.user()._id;
        var ideaOwnerName = Meteor.users.findOne(ideaOwnerID).profile.shortcode;
        var ideaCreatedAtDate = moment().format("DD-MM-YYYY");
        var ideaCreatedAtTime = moment().format('HH:mm');

        console.log(ideaTitle +" "+ ideaOwnerID +" "+ ideaOwnerName +" "+ideaCreatedAtDate +" "+ideaCreatedAtTime);

        var result = Ideas.insert({
            title: ideaTitle ,
            owner: ideaOwnerName,
            description: ideaDescription,
            start: ideaDate,
            createdAt: ideaCreatedAtDate,
            createdAtTime: ideaCreatedAtTime,
            color: '#838383',
            likes : 0
        });
        console.log(result)
        //Clear form
        event.target.ideaTitle.value = '';
        event.target.ideaDate.value = '';
        document.querySelector('#ideaDescription').value=''; //Textarea clear
    },
    'click .dropdown': function(event) {
        $('.accordion')
            .accordion({
                selector: {
                    trigger: '.dropdown'
                }
            })
        ;
    },
    'click .like': function(event){
        var currentUserID = Meteor.user()._id;
        var ideaIDVar = event.target.value;
        var currentLikes = Ideas.findOne(ideaIDVar).likes;
        var hasVoters = Ideas.findOne({_id: ideaIDVar, voters: currentUserID}) === undefined ? false : true
        if(hasVoters == false){
            Ideas.update(ideaIDVar, {
                $addToSet: {
                    voters: currentUserID
                }
            });
                currentLikes = currentLikes + 1;
                Ideas.update(ideaIDVar, {
                    $set: {
                        "likes": currentLikes
                    }
                });
            }
        else {
            Bert.alert('Idee wurde schon geliked','danger');
        }
    },
    'click .remove': function(event){
        var ideaIDVar = event.target.value;
        if(ideaIDVar.length = 0)
            Bert.alert("Keine ID vorhanden", 'danger');
        else
        {
            Ideas.remove(ideaIDVar);
            Bert.alert("Idee entfernt", 'success');
        }
    },
    'click .apply': function(event){
        var ideaIDVar = event.target.value;
        var idea = Ideas.findOne(ideaIDVar);
        var comments = Comments.find({ideaID: ideaIDVar, flagged: true}).fetch();
        var ideaString = idea.description;
        var commentString = '';
        for(i=0; i<comments.length; i++) {
            commentString = commentString + ' ' + comments[i].text;
        }
        ideaString = ideaString + ' ' + commentString;
        console.log('title: '+ idea.title+ ' date: '+idea.start+ ' idea: '+ideaString);
            ProdList.insert({
                _id: ideaIDVar,
                title: idea.title ,
                thema: 'nicht festgelegt',
                format: 'nicht festgelegt',
                idea: idea.description
            });
            Bert.alert("Idee zu Produktion gewandelt", 'success');

        if(idea.start != '') {
            Events.insert({
                prID: ideaIDVar,
                title: idea.title,
                allday: true,
                start: idea.start,
                color: '#D01919',
                categorie: 'production'
            });
        }
        Ideas.remove(ideaIDVar);

    },
    'click .fav': function(event){
        var commentID = event.target.value;
        var comment = Comments.findOne(commentID);
        if(comment.flagged === false) {
            Comments.update(commentID, {
                $set: {
                    flagged: true
                }
            });
            Bert.alert("Kommentar zur Pinwand hinzugefügt", 'success');
        }
        else {
            Comments.update(commentID, {
                $set: {
                    flagged: false
                }
            });
            Bert.alert("Kommentar von Pinwand entfernt", 'success');
        }


    },
    'submit .comment': function(event) {
        event.preventDefault();
        var ideaID = event.target.ideaID.value;
        var comment = event.target.comment.value;
        var commentDate = moment().format("DD-MM-YYYY");
        var commentTime = moment().format('HH:mm');
        var authorID = event.target.authorID.value;
        var author = Meteor.users.findOne(authorID).profile.shortcode;

        if(comment != '') {
            Comments.insert({
                ideaID: ideaID,
                text: comment,
                createdAt: commentDate,
                createdAtTime: commentTime,
                author: author,
                flagged: false
            });
            document.querySelector('#comment').value=''; //Textarea clear
            Bert.alert('Kommentar hinzugefügt',' success');
        }
        else
            Bert.alert('Kommentarfeld ist leer!',' danger');


    }

});

Template.ideas.helpers({
    ideas: function() {
        return Ideas.find().fetch().reverse();
    },
    comments: function(id) {
        var comments = Comments.find({ideaID: id}).fetch();
        if(comments != undefined) {
            return comments;
        }
    },
    flagColor: function(id) {
        var comment = Comments.findOne(id);
        if(comment.flagged === false)
            return 'orange';
        else
            return 'green';


    }
});

Template.ideas.onRendered(function() {
    //Mini-Kalender bei Termin anlegen
    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            horizontal: 'left',
            vertical: 'bottom'
        },
        locale: 'de'
    });
});