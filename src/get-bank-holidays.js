import * as d3 from "d3";

function extractBankHolidays(data){
  return new Promise(function(resolve, _reject){
    var events = data["events"].map(d => d3.timeParse("%Y-%m-%d")(d["date"]));

    resolve(events);
  });
}

// Promise based fetch of bank holidays in England and Wales
function getBankHolidays(){
  return d3.json("https://www.gov.uk/bank-holidays/england-and-wales.json").then(extractBankHolidays);
}

export {getBankHolidays};
