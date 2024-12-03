//Först skapar jag en variabel för att kunna lagra API nyckeln, Den kommer att dynamiskt fyllas.
let apiNyckeln ="";

//den Async funktionen GetapiNyckeln används för att hämta API med hjälp av en POST-förfråga
async function GetApiNyckeln() {
    //fetch används för att hämta API-nyckeln med hjälp av en POST förfråga
const svarstid = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
    method: 'POST',
});
//JSON svaret kommer att extraheras då den innehåler API-nyckeln 
const informationen = await svarstid.json();
return informationen.key;
}

//Functionerna kommer att hämta och visa upp planeterna 
async function planeternaHämtas() {
    try { 
        //Används för att hämta API nyckeln 
    const nyckelnTillAPI = await GetApiNyckeln();

    //Nyckeln används för att få datan om himlakropparna ifrån APIet 
    const svar = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies',{
      method: 'GET',
      headers: {'x-zocom': nyckelnTillAPI }
    });
    //Ser till att JSON blir extraherat från svaret 
    const datans = await svar.json();

    //En referens till det element där planeterna ska visas upp 
    const solensSystem = document.getElementById("sol-system");

       //ett if statement för att kontrollera om datan är giltig och innehåller en lista 
     if(datans && datans.bodies && Array.isArray(datans.bodies)) {
          //Ser till att listan blir filtrerad så den endast innehåller planeter
        const planets = datans.bodies.filter(body=> body.type=== "planet");

        //gör så att planeterna visas på sidan 
        visarPlaneterna(planets);
        
        //En eventListener för att sökfältet ska fungera 
        document.getElementById("sökning").addEventListener("input", (event) => {
            const söklistan = event.target.value.toLowerCase(); //Använder användarens sökord 
            //Använder sökord för att filtrera planetens lista 
            const filtreradePlaneter = planets.filter(planet => planet.name.toLowerCase().includes(söklistan));
            visarPlaneterna(filtreradePlaneter); //Kommer att visa dem planeterna som filtrerats 
        });
} else {
    console.error("Hittade ingen plantetsdata"); //felhantering ifall ingen data hittas 
}
  } catch (error) {
    console.error("ett fel inträffade vid hämtningen av planeterna ", error.message); //Visar felmeddelanden vid ett undantag 
  }
}
 //Funktion som används då planeterna ska visas på sidan 
function visarPlaneterna(planeter) {
    //referens som leder till element där planeterna visas upp
    const solensSystem = document.getElementById("sol-system");

    //ser till att tidigare innehåll rensas 
    solensSystem.innerHTML = "";

    //lägger till planeterna på sidan och itererar över dem
    planeter.forEach(planet => {
        //Skapar ett div-element för var planet 
        const planeterAll = document.createElement('div');
        planeterAll.className='planet';
        planeterAll.textContent=planet.name;

        //Ville att planeterna skulle ha olika färger så använde mig av deras namn för att sätta bakgrundsfärgen 
       switch (planet.name.toLowerCase()) {
        case 'mars':
            planeterAll.style.background = "red";
            break;
        case 'jupiter':
            planeterAll.style.background = "#C2B280";
            break;
        case 'venus':
            planeterAll.style.background = "#f9c45e";
            break;
        case 'saturnus':
            planeterAll.style.background = "#e1c680";
            break;
        case 'jorden':
        planeterAll.style.background = "blue";
            break;
        case 'uranus':
            planeterAll.style.background = "#0d98ba";
            break;
            case 'neptunus':
            planeterAll.style.background = "blue";
            break;
            case 'merkurius':
                planeterAll.style.background = "grey";
                break;
        default:
            planeterAll.style.background = "red"; //Röd används som en standardfärg 
            break;
       }
        planeterAll.addEventListener("click", () => detaljerVisa(planet)); //En klick händelse visar upp detaljer om planeterna 
        solensSystem.appendChild(planeterAll); //Använder DOMen för att lägga till planeternas element 
    });
}

//Visar detaljerna bakom planeterna 
function detaljerVisa(planeterAll) {
    //Kommer att visa planeternas detaljvyn då den gör en klass gömd 
  document.getElementById("detaljer-planeter").classList.remove("gömd");
  document.getElementById("planetens-namn").textContent =  planeterAll.name; //Planeternas namn
  document.getElementById("planetens-beskrivning").textContent = planeterAll.desc; //Deras beskrivning 

  //En lista som visar planeternas fakta
  const listaOmFakta = document.getElementById("planetens-fakta");
  listaOmFakta.innerHTML = `
  <li>Det latinska namnet: ${planeterAll.latinName}</li>
  <li>Planeternas rotation: ${planeterAll.rotation}</li>
  <li>Planeternas omkrets: ${planeterAll.circumference}</li>
  <li>Temperaturen över planeterna(dag): ${planeterAll.temp.day}°C</li>
  <li>Temperaturen över planeterna(natt): ${planeterAll.temp.night}°C</li>
  <li>Deras avstånd ifrån solen: ${planeterAll.distance} km</li>
  `;
}

document.getElementById("tillbaka").addEventListener("click", () => { //Använder en klick händelse för att dölja detaljvyn 
    document.getElementById("detaljer-planeter").classList.add("gömd"); //döljer vyn

    document.getElementById("sol-system").style.display="flex"; //Visar upp planeternas system igen
});

planeternaHämtas(); //Ladar sidan och hämtar planeterna 