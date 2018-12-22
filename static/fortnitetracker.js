$(function(){
    // UPDATING STUFF
    var submitBtn = $('#submit');
    var results = $('#results');
    // CLEARING STUFF
    var clearBtn = $('#clearbtn');
    // ADDING STUFF
    var addBtn=$('#addbtn');
    var userSub = $('#userfield');
    var platSub = $('#platfield');
    var userDisp = $('#userdisp');
    var users = [];
    addBtn.click(function(){
        var userToAdd = {};
        userToAdd.username = userSub.val();
        if(userToAdd.username.length == 0){
            return;
        }
        for(var i = 0; i < users.length; i++){
            if(users[i] != undefined && users[i].ignore == false && users[i].username.toLowerCase() == userToAdd.username.toLowerCase()){
                return;
            }
        }
        userToAdd.platform = platSub.val();
        userToAdd.lastmatchid = "0";
        userToAdd.ignore = false;
        $.ajax({
            type: "POST",
            url: '/accountId',
            dataType: 'json',
            data: userToAdd,
            success: function(acdatareturn){
                acdatareturn = JSON.parse(acdatareturn);
                userToAdd.accountId = acdatareturn.accountId;
                if(userToAdd.accountId != undefined){
                    var platform = userToAdd.platform;
                    var icon = "";
                    if(platform == "pc"){
                        icon = '<i class="fas fa-desktop"></i>';
                    }else if(platform == "xbl"){
                        icon = '<i class="fab fa-xbox"></i>';
                    }else if(platform == 'psn'){
                        icon = '<i class="fab fa-playstation"></i>';
                    }
                    var idtoplace = users.length;
                    /*for(var i = 0; i < users.length; i++){
                        if(users[i] == undefined){
                            idtoplace = i;
                            break;
                        }
                    } */
                    var removebutton = '<button type="button" class="btn btn-danger rmvbutton btn-sm" id = "userrm' + idtoplace +'" value = "' + idtoplace +'">X</button>';
                    var toAdd = '<li class="list-group-item" value = "' + idtoplace +'" id = "userrmli' + idtoplace +'">'+ icon + ' ' + userToAdd.username + removebutton + '</li>';
                    if(users.length == 0){
                        userDisp.html("");
                    }
                    users.push(userToAdd);
                    userDisp.append(toAdd);
                    var removethisuserBtn = $('#userrm' + idtoplace);
                    removethisuserBtn.click(function(){
                        var value = removethisuserBtn.val();
                        console.log("REMOVED " + value + " - " + users[value].username);
                        users[value].ignore = true;
                        var removeli = $('#userrmli' + value);
                        removeli.slideToggle();
                        removeli.remove();
                    });
                    updateUser(userToAdd);
                }
            }
        });
        
        
        
    });
    var curUserToCheck = 0;
    window.setInterval(function(){
        var numUsers = users.length;
        if(numUsers > 0){
            var numChecks = 0;
            while(numChecks < numUsers){
                if(curUserToCheck >= numUsers){
                    curUserToCheck = 0;
                }
                if(users[curUserToCheck] != undefined && users[curUserToCheck].ignore == false){
                    console.log("Checking " + users[curUserToCheck].username);
                    updateUser(users[curUserToCheck]);
                    curUserToCheck++;
                    break;
                }
                curUserToCheck++;
                numChecks++;
            }
        }
    }, 5000);

    function updateUser(thisuser){
        $.ajax({
            type: "POST",
            url: '/',
            dataType: 'json',
            async: false,
            data: thisuser,
            success: function(data){
                data = JSON.parse(data)[0];
                if(data.id != thisuser.lastmatchid && data.matches == 1){
                    appendMatch(thisuser, data);
                    thisuser.lastmatchid = data.id;
                }
            }
        });
    }
    submitBtn.click(function(){
        var numUsers = users.length;
        for(var i = 0; i < numUsers; i++){
            var thisuser = users[i];
            $.ajax({
                type: "POST",
                url: '/',
                dataType: 'json',
                async: false,
                data: thisuser,
                success: function(data){
                    data = JSON.parse(data)[0];
                    if(data.id != thisuser.lastmatchid){
                        appendMatch(thisuser, data);
                        thisuser.lastmatchid = data.id;
                    }
                }
            });
        }
    });
    function appendMatch(acdata, data){
        var playlist = "LTM";
        if(data.playlist == "p9"){
            playlist = "Squads";
        }else if(data.playlist == "p10"){
            playlist = "Duos";
        }else if(data.playlist == "p2"){
            playlist = "Solos";
        }
        var platform = acdata.platform;
        var icon = "";
        if(platform == "pc"){
            icon = '<i class="fas fa-desktop"></i>';
        }else if(platform == "xbl"){
            icon = '<i class="fab fa-xbox"></i>';
        }else if(platform == 'psn'){
            icon = '<i class="fab fa-playstation"></i>';
        }
        var template = "";
        if(data.top1 == 1){
            template = '<div class="card text-center">' +
                            '<div class="card-header win-header">' +
                            icon + ' ' + acdata.username +
                            '</div>' +
                            '<div class="card-body win-body">' + 
                                playlist + ' - ' + data.kills + ' kills' +
                            '</div>' +
                        '</div>';
        }else{
            template = '<div class="card text-center">' +
                            '<div class="card-header">' +
                            icon + ' ' + acdata.username +
                            '</div>' +
                            '<div class="card-body">' + 
                                playlist + ' - ' + data.kills + ' kills' +
                            '</div>' +
                        '</div>';
        }
        
        $(template).hide().prependTo(results).fadeIn(1000);
    }
    clearBtn.click(function(){
        results.html('');
    });
});
