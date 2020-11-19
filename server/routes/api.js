
const express = require('express')
const router = express.Router()
const { data, map } = require('jquery')
const urllib = require('urllib');
const dreamTeam = []

const teamToIDs = {
    "lakers": "1610612747",
    "warriors": "1610612744",
    "heat": "1610612748",
    "suns": "1610612756"
}

router.get('/teams/:teamName', function (req, res) {
    const teamName = req.params.teamName;
    urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function(err, response){
        const data = JSON.parse(response.toString())
        const allData = data.league.standard
        const filteredData = allData.filter(f => f.teamId == teamToIDs[teamName])
        const finalData = filteredData.map(fd => ({'firstName': fd.firstName, 'lastName': fd.lastName, 'jersey': fd.jersey, 'pos': fd.pos}))
        res.send(finalData)
    })
})

router.get('/playerStats/:player', function (req, res) {
    const player = req.params.player;
    urllib.request('https://nba-players.herokuapp.com/players-stats/', function(err, response){
        const data = JSON.parse(response.toString())
        const filteredData = data.filter(f => f.name == player)
        res.send(filteredData)
    })
})

router.put('/team', function(req, res){
    let team = req.body
    let teamName = team.teamName
    let teamId = team.teamId
    let newTeam = {teamName, teamId}
    res.send(newTeam);

})

// Allow users to remove players from the dreamTeam array
router.delete('/dreamTeam/:playerName', function (req, res) {
    let playerName = req.params.playerName.split(" ")
    let firstName = playerName[0]
    let lastName = playerName[1]
    let playerIndex = dreamTeam.findIndex(d => d.firstName === firstName && d.lastName === lastName)
    dreamTeam.splice(playerIndex, 1)
    res.send(dreamTeam)
})

urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function(err, response){
    const data = JSON.parse(response.toString())
    const allData = data.league.standard
    const mapData = allData.map(fd => ({'firstName': fd.firstName, 'lastName': fd.lastName, 'jersey': fd.jersey, 'pos': fd.pos}))
    const lebronData = mapData.find(f => f.firstName == "LeBron")
    const curryData = mapData.find(f => f.firstName == "Stephen")
    const durantData = mapData.find(f => f.lastName == "Durant")
    const thompsonData = mapData.find(f => f.lastName == "Thompson")
    const greenData = mapData.find(f => f.firstName == "Draymond")
    dreamTeam[0] = lebronData
    dreamTeam[1] = curryData
    dreamTeam[2] = durantData
    dreamTeam[3] = thompsonData
    dreamTeam[4] = greenData
    router.get('/dreamTeam', function (req, res) {
        res.send(dreamTeam)
    })
})

router.post('/roster', function (req, res) {
    let flag = true
    const player = req.body
    for(let p of dreamTeam){
        if(p.firstName == player.firstName && p.lastName == player.lastName){
            flag = false; // Prevent the user from adding the same player to the dreamTeam array
            break;
        }
    }
    if(flag){
        dreamTeam.push(player)
    }
    res.send(dreamTeam);  
})

module.exports = router


