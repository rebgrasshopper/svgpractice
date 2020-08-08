
let queryData;
let ready = false;


//query ncov-19.us api
$.ajax({
    url: "https://covid19-us-api.herokuapp.com/county",
    method: "GET"
}).then(function(response){
    queryData = response;
    console.log(queryData);
    getReady();
})

//display function for ajax query of Covid data
function displayCounty(e) {

    const countyName = $(this).attr("id").replace(/_/g, " ").replace("1", "");
    console.log(countyName);
    findCounty(countyName);
}

//search queryData.message for a particular county
function findCounty(needle) {
    console.log("FC: begin");
    for (let item of queryData.message) {
        if (item.county_name === needle) {
            console.log(item);
            return item
        }
    }
  };

  //remove loading gif when ajax query is returned
  function getReady() {
    ready = true;
    $("#loading").css("display", "none");
    $("path").on("click", displayCounty);
    $("polyline").on("click", displayCounty);
    $("polygon").on("click", displayCounty);

    $("path").addClass("hover");
    $("polyline").addClass("hover");
    $("polygon").addClass("hover");
    
  }