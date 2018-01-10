// set number formatting
accounting.settings = {
	number: {
		precision : 2,  // default precision on numbers is 0
		thousand: ",",
		decimal : "."
	}
}

// specify the columns
var columnDefs = [
    {headerName: "", field: "currency"}
];

var a = moment(Date.now()); 
for(var i = -5; i < 0; i++){
    var b = a.clone().add(i, 'month').endOf('month');
    columnDefs.push( { headerName: b.format('MMM DD, YYYY').toString(), field: b.format('YYYY-MM-DD').toString() } );
}

var currencies = ["INR","USD","EUR","GBP"]
var rowData = []
// get the data form openexchange API and save it to rowData as object
currencies.forEach(function (currency){
    var myObj = { currency: currency}
    columnDefs.slice(1).forEach(function (arrItem){
        getJSON('https://openexchangerates.org/api/historical/' + arrItem.field + '.json?app_id=a4cb358bd4ea4f7d8e143d5b5e9831b5&base=USD&symbols=' + currency + '&callback',
            function(err, data) {
                if (err !== null) {
                    alert('Something went wrong with the openexchange API: ' + err);
                } else {
                    myObj[arrItem.field] = accounting.formatNumber(data.rates[currency]);
                }
            }
        );
    });
    rowData.push(myObj); 
});

// let the grid know which columns and what data to use
var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    enableColResize: true,
    onGridReady: function () {
        gridOptions.api.sizeColumnsToFit();
    }
};

// used in our jasmine test
function selectAllRows() {
    gridOptions.api.selectAll();
}

// get json data
function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function convertAmount(amount){
    console.log(amount);
};

// wait for the document to be loaded, otherwise ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});