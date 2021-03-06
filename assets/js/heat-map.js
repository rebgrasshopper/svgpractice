"use strict"


const californiaCounties = [
    { "name": "Alameda", "censusCode": "001", "population": "" },
    { "name": "Alpine", "censusCode": "003", "population": "" },
    { "name": "Amador", "censusCode": "005", "population": "" },
    { "name": "Butte", "censusCode": "007", "population": "" },
    { "name": "Calaveras", "censusCode": "009", "population": "" },
    { "name": "Colusa", "censusCode": "011", "population": "" },
    { "name": "Contra Costa", "censusCode": "013", "population": "" },
    { "name": "Del Norte", "censusCode": "015", "population": "" },
    { "name": "El Dorado", "censusCode": "017", "population": "" },
    { "name": "Fresno", "censusCode": "019", "population": "" },
    { "name": "Glenn", "censusCode": "021", "population": "" },
    { "name": "Humboldt", "censusCode": "023", "population": "" },
    { "name": "Imperial", "censusCode": "025", "population": "" },
    { "name": "Inyo", "censusCode": "027", "population": "" },
    { "name": "Kern", "censusCode": "029", "population": "" },
    { "name": "Kings", "censusCode": "031", "population": "" },
    { "name": "Lake", "censusCode": "033", "population": "" },
    { "name": "Lassen", "censusCode": "035", "population": "" },
    { "name": "Los Angeles", "censusCode": "037", "population": "" },
    { "name": "Madera", "censusCode": "039", "population": "" },
    { "name": "Marin", "censusCode": "041", "population": "" },
    { "name": "Mariposa", "censusCode": "043", "population": "" },
    { "name": "Mendocino", "censusCode": "045", "population": "" },
    { "name": "Merced", "censusCode": "047", "population": "" },
    { "name": "Modoc", "censusCode": "049", "population": "" },
    { "name": "Mono", "censusCode": "051", "population": "" },
    { "name": "Monterey", "censusCode": "053", "population": "" },
    { "name": "Napa", "censusCode": "055", "population": "" },
    { "name": "Nevada", "censusCode": "057", "population": "" },
    { "name": "Orange", "censusCode": "059", "population": "" },
    { "name": "Placer", "censusCode": "061", "population": "" },
    { "name": "Plumas", "censusCode": "063", "population": "" },
    { "name": "Riverside", "censusCode": "065", "population": "" },
    { "name": "Sacramento", "censusCode": "067", "population": "" },
    { "name": "San Benito", "censusCode": "069", "population": "" },
    { "name": "San Bernardino", "censusCode": "071", "population": "" },
    { "name": "San Diego", "censusCode": "073", "population": "" },
    { "name": "San Francisco", "censusCode": "075", "population": "" },
    { "name": "San Joaquin", "censusCode": "077", "population": "" },
    { "name": "San Luis Obispo", "censusCode": "079", "population": "" },
    { "name": "San Mateo", "censusCode": "081", "population": "" },
    { "name": "Santa Barbara", "censusCode": "083", "population": "" },
    { "name": "Santa Clara", "censusCode": "085", "population": "" },
    { "name": "Santa Cruz", "censusCode": "087", "population": "" },
    { "name": "Shasta", "censusCode": "089", "population": "" },
    { "name": "Sierra", "censusCode": "091", "population": "" },
    { "name": "Siskiyou", "censusCode": "093", "population": "" },
    { "name": "Solano", "censusCode": "095", "population": "" },
    { "name": "Sonoma", "censusCode": "097", "population": "" },
    { "name": "Stanislaus", "censusCode": "099", "population": "" },
    { "name": "Sutter", "censusCode": "101", "population": "" },
    { "name": "Tehama", "censusCode": "103", "population": "" },
    { "name": "Trinity", "censusCode": "105", "population": "" },
    { "name": "Tulare", "censusCode": "107", "population": "" },
    { "name": "Tuolumne", "censusCode": "109", "population": "" },
    { "name": "Ventura", "censusCode": "111", "population": "" },
    { "name": "Yolo", "censusCode": "113", "population": "" },
    { "name": "Yuba", "censusCode": "115", "population": "" },
]

const timeLapseMap = []
let wholeData;






//AJAX QUERIES - county population from US Census, historical Covid data by CA county

//query current and past county data
let censusCountyURL = "https://api.census.gov/data/2019/pep/population?key=45876004e2fbfafe56615f040f2172ee79c77643&get=POP&in=state:06&for=county:*";

$.ajax({
    url: censusCountyURL,
    method: "GET"
}).then(function (response) {
    locateCountyPopulation(response);
})


// let csvCounty = "San Diego"
// let csvURL = "https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q=" + csvCounty;

let csvSource = "https://data.ca.gov/dataset/590188d5-8545-4c93-a9a0-e230f0db7290/resource/926fd08f-cc91-4828-af38-bd45de97f8c3/download/statewide_cases.csv";
let csvURL = "https://c19d.zzzkitty.com/?source=" + csvSource;

$.ajax({
    url: csvURL,
    method: "GET"
}).then(function (response) {
    getReady();
    wholeData = response;

    setTimeLapseMap(response);
    setMainMap(response);


}
)







//FUNCTIONS



//CALCULATION FUNCTIONS

//calculate rate of incidence per 100,000 population
function calculateRate(incidence, population) {
    return (parseInt(incidence) / parseInt(population)) * 100000;
}

//return total of all new cases in the last two weeks
function setLast14(dataset, indexNum) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 14; i++) {
        if (dataset[index].newcountconfirmed) {
            total += parseInt(dataset[index].newcountconfirmed);
        }

        index--;
    }
    return total;
}

//return total of all new cases in the last two weeks
function setNext14(dataset, indexNum) {
    let total = 0;
    let index = indexNum;
    for (let i = 0; i < 14; i++) {
        if (dataset[index]){
        if (dataset[index].newcountconfirmed) {
            total += parseInt(dataset[index].newcountconfirmed);
        }
    }
        index++;
    }
    return total;
}



//DISPLAY FUNCTIONS

//remove loading gif when ajax query is returned
function getReady() {
    $("#loading").css("display", "none");

    $("path").on("click", displayCounty);
    $("polyline").on("click", displayCounty);
    $("polygon").on("click", displayCounty);
    $("#play").on("click", runTimeLapse);

    $("path").addClass("hover");
    $("polyline").addClass("hover");
    $("polygon").addClass("hover");
}

//display county info on click
function displayCounty(e){
    
    const info = $("#info");
    info.empty();
    info.css("display", "block");
    
    const countyName = $(this).attr("id").replace(/_/g, " ");
    
    const thisCounty = findCounty(countyName);
    
    const countyHeader = $(`<h5>${thisCounty.name} County</h5>`);
    info.append(countyHeader);
    info.append($("<hr>"))
    
    const countyRecent = $(`<p><strong>Cases in last 14 days: </strong>${thisCounty.recentCases}</p>`);
    info.append(countyRecent);
    
    const countyInfectionRate = $(`<p><strong>Infections/100,000: </strong>${thisCounty.infectionRate.toFixed(1)}</p>`);
    info.append(countyInfectionRate);
    
    const infectionInfo = $("<p class='fine-print'>Infection rate calculated by new cases in past 14 days over total population, times 100,000</p>")
    info.append(infectionInfo);
    
    const countyFatalityRate = $(`<p><strong>Fatality rate: </strong>${thisCounty.fatalityRate.toFixed(1)}%</p>`);
    info.append(countyFatalityRate);
    
    const fatalityInfo = $("<p class='fine-print'>Fatality rate calculated by total deaths over total cases, times 100</p>");
    info.append(fatalityInfo);
    
    
}

function setTimeLapseMap(response){
    
    let howManyCounties = 0;
    for (let county of californiaCounties) {

        const newArray = [];


        length = findMostRecent(response, county.name) - findFirst(response, county.name);
        
        
        let addToIndex = 0;

        for (let i = 0; i < length/14; i++) {
            const newObject = {};
            newObject.name = county.name;


            let recentIndex = findFirst(response, county.name)
            newObject.firstIndex = recentIndex;

            let totalNewCases = setNext14(response, recentIndex + addToIndex);
            newObject.recentCases = totalNewCases;

            let ratePer = calculateRate(totalNewCases, county.population);
            newObject.infectionRate = ratePer;

            let fatalityRate = parseInt(response[recentIndex].totalcountdeaths)/parseInt(response[recentIndex].totalcountconfirmed) * 100;
            newObject.fatalityRate = fatalityRate;

            newObject.color = findRateGroup(ratePer, county.name);

            addToIndex += 14;
            newArray.push(newObject);
        }
        timeLapseMap.push(newArray);
    }
}

function setMainMap(response){
    for (let county of californiaCounties) {
        let recentIndex = findMostRecent(response, county.name)

        let totalNewCases = setLast14(response, recentIndex);
        county.recentCases = totalNewCases;

        let ratePer = calculateRate(totalNewCases, county.population);
        county.infectionRate = ratePer;

        let fatalityRate = parseInt(response[recentIndex].totalcountdeaths)/parseInt(response[recentIndex].totalcountconfirmed) * 100;
        county.fatalityRate = fatalityRate;

        findRateGroup(ratePer, county.name);
    }
}

function runTimeLapse(response){
    let data = response;
    let i = 0;
    const timeLapse = setInterval(function(data){

        for (let k=0;k<timeLapseMap.length;k++){
            findRateGroup(timeLapseMap[k][i].infectionRate, timeLapseMap[k][i].name);
        }



        i++;
        if (i>=timeLapseMap[0].length-2){ //-2 because the last section of timeLapseMap may not contain a full 14 days, so it's prefereable to use MainMap, which relies on the most recent 14 days data
            clearInterval(timeLapse)
            setMainMap(wholeData);
        }
    }, 2000)
}



//LOCATION FUNCTIONS

//find index of most recent data from covid county data query
function findMostRecent(dataset, countyName) {
    return dataset.map(el => el.county).lastIndexOf(countyName);    
}

//find index of earliest data from covid county data query
function findFirst(dataset, countyName) {
    return dataset.map(el => el.county).indexOf(countyName);    
}

//search queryData.message for a particular county
function findCounty(needle) {
    for (let item of californiaCounties) {
        if (item.name === needle) {
            return item
        }
    }
};

//find class for heat map color
function findRateGroup(number, countyName) {
    let rate;
    if (number <= 1) {
        rate = "r1";
    } else if (number <= 5) {
        rate = "r5";
    } else if (number <= 15) {
        rate = "r15";
    } else if (number <= 30) {
        rate = "r30";
    } else if (number <= 50) {
        rate = "r50";
    } else if (number <= 100) {
        rate = "r100";
    } else if (number <= 150) {
        rate = "r150";
    } else if (number <= 200) {
        rate = "r200";
    } else if (number <=500) {
        rate = "r500";
    } else {
        rate = "rMore";
    }
    $(`#${countyName.replace(/\s/g, "_")}`).removeClass();
    $(`#${countyName.replace(/\s/g, "_")}`).addClass("hover");
    $(`#${countyName.replace(/\s/g, "_")}`).addClass(rate);
}

//get county code from californiaCountyIDs, and find the matching population data from Census API response
function locateCountyPopulation(dataset) {
    for (let county of californiaCounties) {
        for (let array of dataset) {
            if (county.censusCode === array[2]) {
                county.population = array[0];
            }
        }
    }
}


