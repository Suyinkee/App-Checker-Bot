var XLSX = require('xlsx');
var aStore = require('app-store-scraper');
var gStore = require('google-play-scraper');

var config = require("./config.json")       // config file to select which column you want to get the values from
var workbook = XLSX.readFile('./Apps-and-etools-library.xlsx'); // change this if needed

var first_sheet_name = workbook.SheetNames[0];

function main (arrayValue) {
    console.log(arrayValue)
    var column = config[arrayValue].column
    var startrow = config[arrayValue].startrow
    var endrows = config[arrayValue].endrow 
    var all_addresses = []
    for (var x = startrow; x <= endrows; x++ ) {
        all_addresses.push(column+x)
    }
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];

    /* Find desired cell */
    var results = []
    for (var cell in all_addresses) {
        var value = worksheet[all_addresses[cell]]
        if (value) {  
            results.push({ cellValue: value.v, cellAddress: all_addresses[cell]})
        } 
    }
    return results
}

// querying the app store  
function getAppleData() {
    var appleIds = main(0)
    for (var appleObject in appleIds) {
        var aId = appleIds[appleObject].cellValue
        aStore.app({id: aId}).then((data) => {
            console.log({
                dataId: data.id, 
                price: data.price,
                updated: data.updated, 
                version: data.requiredOsVersion, 
                developer: data.developer, 
                developerUrl: data.developerUrl
            }) 
            console.log("")
        }).catch( (err) => {
        });
    }
}

// querying the google store 
function getGoogleData () {
    var googleIds = main(1)
    for (var googleObject in googleIds) {
        var gId = googleIds[googleObject].cellValue
        gStore.app({appId: gId}).then((data) => {
            console.log({
                dataId: data.appId, 
                price: data.price,
                versionText: data.androidVersionText, 
                developer: data.developer, 
                developerWebsite: data.developerWebsite
            }) 
            console.log("")
        }).catch( (err) => {
        });
    }
}

getGoogleData()
getAppleData()

 
