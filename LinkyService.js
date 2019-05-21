
var request = require("request-promise");																																														// Pré requis
var hostname = '192.168.0.40'; 																																																			// Ip de la raspberry
var token = 'e4bd9794ab690ae94f8125e6435335f53ffd1223';																																						  // Token(Gladys). Les tokens sont des clés qui permettent d'accéder à l'API de Gladys à distance en faisant des requêtes HTTP avec le token en paramètre.

const linky = require('@bokub/linky');																																															// Dépendances utilisé sur GitHub
const util = require('util');																																																				// Dépendance
var session = 0;
let conso  = 0;																																																											// Initialisation des differentes variables utilisé
let consoDay = 0;
let consoMonth = 0;
let consoYear = 0;
var i = 0 ;
const setTimeoutPromise = util.promisify(setTimeout);



async function myfunction() {
	session = await linky.login('pierredenarie@gmail.com', 'rk6c%Mmf'); 																															// connection a l'espace client et récuperation d'une session pour récupérer les données de consommation
  //conso  = await session.getHourlyData();																																													// Création de la session pour récuperer la consommation
	consoDay  = await session.getDailyData();																																													// Création de la session pour récuperer de la consommation de l'habitation au jour
	//consoMonth  = await session.getMonthlyData();																																										// Création de la session pour récuperer de la consommation de l'habitation au mois
	//consoYear  = await session.getYearlyData();																																											// Création de la session pour récuperer de la consommation de l'habitation à l'année

}

async function start() {																																																						// definition de la fonction start qui lance myfunction
  return myfunction();																																																							// Renvoie d'une promesse qui sera résolu plus tard
}

function intervalFunc() {
	(async() => {
		await start();
		console.log("ici");
		//request('http://'+hostname+'/devicestate/create/?token='+token+'&devicetype=4&value='+conso[48].value, { json: true } )				//Requête de récuperation de la consommation de l'habitation
		request('http://'+hostname+'/devicestate/create/?token='+token+'&devicetype=5&value='+consoDay[30].value, { json: true } )			//Requête de récuperation de la consommation de l'habitation au jour
		//request('http://'+hostname+'/devicestate/create/?token='+token+'&devicetype=6&value='+consoMonth[12].value, { json: true } )	//Requête de récuperation de la consommation de l'habitation au Mois
		//request('http://'+hostname+'/devicestate/create/?token='+token+'&devicetype=6&value='+consoYear.value, { json: true } )				//Requête de récuperation de la consommation de l'habitation à l'année
		.then(function(value){
			i++;																																																													//Fonction pour parcourir les données de consommation(test)
				if(30 == i ){
					(async() => { await start(); })();
					i=0;
				}
			})
	})();

};

setInterval(intervalFunc,18000);																																																		// Intervalle entre les requetes
