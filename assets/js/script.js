$("path").on("click", displayCounty);
$("polyline").on("click", displayCounty);
$("polygon").on("click", displayCounty);


function displayCounty(e) {

    const countyName = $(this).attr("id").replace(/_/g, " ").replace("1", "");
    console.log(countyName);
}