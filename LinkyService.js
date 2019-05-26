
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
	session = await linky.login('ID', 'MDP'); 																															// connection a l'espace client et récuperation d'une session pour récupérer les données de consommation
  conso  = await session.getHourlyData();																																														// Création de la session pour récuperer la consommation
	consoDay  = await session.getDailyData();																																													// Création de la session pour récuperer de la consommation de l'habitation au jour
	//consoMonth  = await session.getMonthlyData();																																										// Création de la session pour récuperer de la consommation de l'habitation au mois
	//consoYear  = await session.getYearlyData();																																											// Création de la session pour récuperer de la consommation de l'habitation à l'année

}

async function start() {																																																						// definition de la fonction start qui lance myfunction
  return myfunction();																																																							// Renvoie d'une promesse qui sera résolu plus tard
}

function intervalFuncHour() {
	(async() => {
		await start();
		console.log(conso[47].value);
		request('http://'+hostname+'/devicestate/create/?token='+token+'&devicetype=4&value='+conso[i].value, { json: true } )					//Requête de récuperation de la consommation de l'habitation à lheure
		.then(function(value){																																																					//Promise : à chaque requ^ete on incrémenta la valeur i pour récupérer la valeur suivante
			i++;
				if(47 == i ){
					(async() => { await start(); })();
					i=0;
				}
			})
	})();

};
function intervalFuncDay() {
	(async() => {
		await start();
		request('http://'+hostname+'/devicestate/create/?token='+token+'&devicetype=5&value='+consoDay[30].value, { json: true } )			//Requête de récuperation de la consommation de l'habitation au jour
	})();

};
//function intervalFuncMonth() {
//	(async() => {
//		await start();
//		request('http://'+hostname+'/devicestate/create/?token='+token+'&devicetype=6&value='+consoMonth[12].value, { json: true } )	//Requête de récuperation de la consommation de l'habitation au Mois
//	})();
//};
//function intervalFuncYear() {
//	(async() => {
//		await start();
//		request('http://'+hostname+'/devicestate/create/?token='+token+'&devicetype=6&value='+consoYear.value, { json: true } )				//Requête de récuperation de la consommation de l'habitation à l'année
//	})();
//};

setInterval(intervalFuncHour,1800000);																																															// Intervalle de Lancement des requêtes pour la consommation a l'heure
setInterval(intervalFuncHour,86400000);																																															// Intervalle de Lancement des requêtes pour la consommation au jour
//setInterval(intervalFuncHour,2592000000);																																													// Intervalle de Lancement des requêtes pour la consommation au mois
//setInterval(intervalFuncHour,31536000000);																																												// Intervalle de Lancement des requêtes pour la consommation a l'année
