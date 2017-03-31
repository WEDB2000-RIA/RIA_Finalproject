var items;	  // For whole data
var item;     // For selected item
var category; // For sorting

//Assigned to Paddy

$(function () {
    loadProducts(category);
    $('#all').click(function(){
    	category = "";
        loadProducts(category);
    });
    $('#phone').click(function(){
        category = "category=Phone";
        loadProducts(category);
    });
    $('#tv').click(function(){
        category = "category=TV";
        loadProducts(category);
    });
    $('#laptop').click(function(){
        category = "category=Laptop";
        loadProducts(category);
    });
});


//Assigned to Paddy
//loadProducts Function will load image and name of all products from Server 

$(function () {
    loadProducts(category);
}function loadProducts(sortBy){
    $("#spinner").removeClass("hidden");
    $.ajax({
        type:"GET",
        url: "http://localhost:3000/products?"+category,
        dataType:"JSON",
        //cache : false, 
        success: function(data) {
            items = data;
            $("#spinner").addClass("hidden");
            $("#products").html(""); //initialize
            for (var i = 0; i < data.length; i++) {
            //alert(data[i].image)
            var product =	`<div class="col-sm-3 col-xs-6">` +
                              	`<a  href='#' onclick="loadItem(`+i+`)">` +
                                	`<img class="img-responsive portfolio-item" src="./img/${data[i].image}">` +
                                `</a>`	+
                                `<h4>${data[i].name}</h4>` +
                                //`<p>${data[i].price}</p>`	+
                        	`<hr><hr></div>`;
            $("#products").append(product);
            }   

        },
        error: function(error) {
            $("$spinner").addClass("hidden");
            alert("There was an error retrieving the data.");
        }
    }); // ajax
}

//Assigned to Paddy
//loadItem Function will load data when user pick the image on product
function loadItem(i){

}
