
const togglePopup = function(){
    document.getElementById("popup-1").classList.toggle("active");
}

const getTeamPlayers = function() {
    const teamName = $("#nbaTeam").val();
    $.get(`teams/${teamName}`, function (data) {
        const source = $('#store-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({data});
        $('.results').empty().append(newHTML);
    })
}

const dreamTeamPlayers = function () {
    $.get(`dreamTeam`, function (data) {
        const source = $('#store-template-dreamTeam').html();
        const template = Handlebars.compile(source);
        const newHTML = template({data});
        $('.results').empty().append(newHTML);
    })
}

// When you click on any player's image, it will display the player's stats over the image.
$('.results').on('click', '.playerImg', function(){
    const player = $(this).closest('.player').find('.playerName').text()
    $.get(`/playerStats/${player}`, function (data) {
        $('.title').empty().append(player)
        if(data.length == 0){ // if no info exist
            document.getElementById("popup-1").classList.toggle("active");
            $('.playerSt').empty().append('no information');
        }
        else{
            const source = $('#store-template-playerStats').html();
            const template = Handlebars.compile(source);
            const newHTML = template({data});
            document.getElementById("popup-1").classList.toggle("active");
            $('.playerSt').empty().append(newHTML);
        }
    })
})

// When you click on any player's name, it will add the player to the dreamTeam
$('.results').on('click', '.playerName', function(){
    const name = $(this).closest('.player').find('.playerName').text()
    const lastAndFirstName = name.split(" ")
    const firstName = lastAndFirstName[0]
    const lastName = lastAndFirstName[1]
    const img = $(this).find('img').attr('src')
    const jersey = $(this).closest('.player').find('.jersey').text()
    const pos = $(this).closest('.player').find('.pos').text()
    const player = {firstName, lastName, img, jersey, pos}
    $.post("/roster", player, function(response)
    {
        const source = $('#store-template').html();
        const template = Handlebars.compile(source);
        const newHTML = template({response});
        $('.results').append(newHTML);
    }
)})

const deleteFromDreamTeam = function (playerName) {
    $.ajax({
        url: `dreamTeam/${playerName}`,
        method: "DELETE",
        success: function (data) {
            const source = $('#store-template-dreamTeam').html();
            const template = Handlebars.compile(source);
            const newHTML = template({data});
            $('.results').empty().append(newHTML);
        }
    })
}

$('.results').on('click', '.delete-player', function(){
    const playerName = $(this).closest('.player').find('.playerName').text()
    deleteFromDreamTeam(playerName)

})

const standby = function(obj){
    console.log('error')
    $(obj).attr('src', 'https://akessonbygg.se/wp-content/uploads/2016/01/Anonym.jpg')
    $(obj).css('width', '60%')
    $(obj).css('margin-top', '20px')
}

