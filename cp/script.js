

$("#cURLSubmit").click(function(){
    var html = "";
    var link = $("#challongeURL").val();
    var match = /http:\/\/((\w+)\.)?challonge.com\/(\w+)(\/.+)?/g;
    //var matched = link.exec(/http:\/\/((\w+)\.)?challonge.com\/(\w+)(\/.+)?/g);
    var matched = match.exec(link);
    if (matched){

        //Get tournament ID
        var tournamentID;
        if (matched[2]){
            tournamentID = matched[2] + "-" + matched[3];
        } else {
            tournamentID = matched[3];
        }
        console.log("tournamentID: " + tournamentID);

        //Get tournament participant information from Challonge
        var apiURL = "https://api.challonge.com/v1/tournaments/" + tournamentID + "/participants.xml?api_key=r4tmsVLtBXvRwNYgQYsazXVtY4tcNc0AHcsAUzpm"
        console.log(apiURL);
        $.get(apiURL, function(data) {
           console.log(data);
        });
    } else {
        html += "ERROR: No matched URL.";
    }



    $("#main").html(html);
});