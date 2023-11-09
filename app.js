const matchesTable = document.getElementById("matches");
const leagueList = document.getElementById("leagueList");
const apiKey = '094d22a8afba0d142c92f7af1d582e36';
var allGameData = [];
var leagues = [ {name: "A League - Australia", key: "soccer_australia_aleague"}, 
                {name: "Priemier League - England", key: "soccer_epl"}, 
                {name: "La Liga - Spain", key: "soccer_spain_la_liga"},
                {name: "Bundesliga - Germany", key: "soccer_germany_bundesliga"},
                {name: "Serie A - Italy", key: "soccer_italy_serie_a"},
                {name: "Ligue 1 - France", key: "soccer_france_ligue_one"}]

start();
function start() {
    var listItem = document.createElement('option');
    listItem.innerHTML = "-- Select league --";
    listItem.value = "test";
    document.getElementById("leagueList").appendChild(listItem);

    leagues.forEach(item => {
        listItem = document.createElement('option');
        listItem.innerHTML = item.name;
        listItem.value = item.key;
        document.getElementById("leagueList").appendChild(listItem);
    })
}
function selectLeague() {
    //A League - soccer_australia_aleague
    //Ligue 1 - France: soccer_france_ligue_one
    //FA Cup - soccer_fa_cup
    //EPL: soccer_epl
    //Bundesliga - Germany: soccer_germany_bundesliga
    //Serie A - Italy - soccer_italy_serie_a
    //La Liga - Spain - soccer_spain_la_liga
    console.log(leagueList.value)
    getData(leagueList.value);
}

function getData(league) {
    
    const comp = league;
    const api = `https://api.the-odds-api.com/v3/odds/?apiKey=${apiKey}&sport=${comp}&region=uk&mkt=h2h`;

    fetch(api)
    .then(response =>{
        return response.json();
    }).then(data => {
        formatData(data);
        createTable();
        console.log(allGameData);
    });
    
}

function convertTime(time) {
    let unix_timestamp = time;
    var date = new Date(unix_timestamp * 1000);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var formattedTime = day.substr(-2) + '/' + month.substr(-2) +'/' + year + ' ' + hours + ':' + minutes.substr(-2);
    
    return formattedTime;    
}

function formatData(data) {
    console.log(data);

    data.data.forEach(game => {
        const gameTime = convertTime(game.commence_time);
        const teams = game.teams;
        const homeTeam = game.home_team;
        const awayTeam = homeTeam === teams[0] ? teams[1] : teams[0];
        const sites = game.sites;
        let allOdds = [];
        sites.forEach(site => {
            const siteName = site.site_nice;
            const odds = homeTeam === teams[0] ? site.odds.h2h : [site.odds.h2h[1], site.odds.h2h[0], site.odds.h2h[2]];
            const siteOdds = {siteName, odds};
            allOdds.push(siteOdds);
        })
        const gameData = {gameTime, homeTeam, awayTeam, allOdds};
        allGameData.push(gameData);
    })
}

function findBestOdds(game, ind) {
    bestOdds = 0
    game.allOdds.forEach((site) => {
        const siteOdds = site.odds[ind];
        if (siteOdds > bestOdds) { bestOdds = siteOdds};
    })
    return bestOdds;
}

function createTable() {
    const newTable = document.createElement('table');
    newTable.setAttribute('border', '1');

    const tabCaption = document.createElement('caption');
    tabCaption.innerHTML = "Upcoming games";
    newTable.appendChild(tabCaption);

    var tbdy = document.createElement('tbody');
        var tr1 = document.createElement('tr');
            var th1 = document.createElement('th');
            th1.innerHTML = "Game";
            var th2 = document.createElement('th');
            th2.innerHTML = "Date";
            var th3 = document.createElement('th');
            th3.innerHTML = "Home Team";
            var th4 = document.createElement('th');
            th4.innerHTML = "";
            var th5 = document.createElement('th');
            th5.innerHTML = "Away Team";

            tr1.appendChild(th1);
            tr1.appendChild(th2);
            tr1.appendChild(th3);
            tr1.appendChild(th4);
            tr1.appendChild(th5);
        tbdy.appendChild(tr1);

        allGameData.forEach((game, index) => {
            const bestHomeOdds = findBestOdds(game, 0);
            const bestDrawOdds = findBestOdds(game, 1);
            const bestAwayOdds = findBestOdds(game, 2);

            let tr = document.createElement('tr');
                let td1 = document.createElement('td');
                td1.classList.add("head1");
                td1.innerHTML = index + 1;
                let td2 = document.createElement('td');
                td2.classList.add("head1");
                td2.innerHTML = game.gameTime;
                let td3 = document.createElement('td');
                td3.classList.add("head1");
                td3.innerHTML = game.homeTeam;
                let td4 = document.createElement('td');
                td4.classList.add("head1");
                td4.innerHTML = "Draw";
                let td5 = document.createElement('td');
                td5.classList.add("head1");
                td5.innerHTML = game.awayTeam;

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tbdy.appendChild(tr);

                game.allOdds.forEach((site) => {
                    const homeOdds = site.odds[0];
                    const drawOdds = site.odds[1];
                    const awayOdds = site.odds[2];

                    var tr_ = document.createElement('tr');
                        let td_1 = document.createElement('td');
                        td_1.innerHTML = "";
                        let td_2 = document.createElement('td');
                        td_2.innerHTML = site.siteName;
                        let td_3 = document.createElement('td');
                        td_3.innerHTML = homeOdds;
                        if (homeOdds == bestHomeOdds) {
                            td_3.classList.add("bestOdds");
                        }
                        let td_4 = document.createElement('td');
                        td_4.innerHTML = drawOdds;
                        if (drawOdds == bestDrawOdds) {
                            td_4.classList.add("bestOdds");
                        }
                        let td_5 = document.createElement('td');
                        td_5.innerHTML = awayOdds;
                        if (awayOdds == bestAwayOdds) {
                            td_5.classList.add("bestOdds");
                        }
                        
                        tr_.appendChild(td_1);
                        tr_.appendChild(td_2);
                        tr_.appendChild(td_3);
                        tr_.appendChild(td_4);
                        tr_.appendChild(td_5);

                        tbdy.appendChild(tr_);
                })
                
        })

    newTable.appendChild(tbdy);
    matchesTable.appendChild(newTable);
}