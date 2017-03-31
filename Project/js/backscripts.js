var sortBy;
var orderBy;
var isEdit = false;
var items;	  // For whole data
var item;     // For selected item

//Sorting and Visual Effects Assigned to Minsu
$(function () {
	readProducts(sortBy, orderBy);
}

//Assigned to Yan
//readProducts Function will load data from server and make table
function readProducts(sortBy, orderBy){
	$("#spinner").removeClass("hidden");
	// ajax call
	$.ajax({
        type:"GET",
        url: "http://localhost:3000/products?_sort="+sortBy+"&_order="+orderBy,
        dataType:"JSON",
        success: function(data) {
            $("#spinner").addClass("hidden");
            $("#table").html(""); //Table Initialize as empty string
			items = data; //all items
            for (var i = 0; i < data.length; i++) {
            // formate date
			dateS = `${data[i].date}`;
            date = new Date(dateS); //for Date formating
            var year = date.getFullYear(); // 4 digits
			// month using 2 digits as Jan:00 - Dec: 11
            var m = date.getMonth(); if (m < 9) { m = "0" + (m + 1); } else { m = (m + 1); }
            var day = date.getDate(); if (day < 10) { day = "0" + day; } 	// using 2 digits
            var hh = date.getHours(); if (hh < 10) { hh = "0" + hh; }	// using 2 digits
            var min = date.getMinutes(); if(min < 10) { min = "0" + min; }	// using 2 digits
			dateInHTML = year + "-" + m + "-" + day + " " + hh + ":" + min ;
			// make table
			var table = `<tr>`                                        +
							`<td>${data[i].name}</td>`                +
							`<td>${data[i].category}</td>`            +
							`<td><p>$ ${data[i].price}</p></td>`      +
							`<td><p>${data[i].stock}</p></td>`        +
							`<td><p>${data[i].description}</p></td>`  +
							`<td>${dateInHTML}</td>`                  +
							`<td>
								<button onclick="loadItem(`+i+`)" type="button" class="btn btn-default">
									<span class="glyphicon glyphicon-pencil"></span>
								</button>
								<button onclick="delItem(`+i+`);" type="button" class="btn btn-default">
									<span class="glyphicon glyphicon-trash"></span>
								</button>
							</td>`                                    +
						`</tr>`                                ;
            $("#table").append(table); // to HTML
            }   
        },
        error: function(error) {
            $("$spinner").addClass("hidden");
            alert("There was an error retrieving the data.");
        }
    }); 
}

//Assigned to Yan
//createUpdateItem Function will create and update data and store to server

//Validation Assigned to Minsu
function createUpdateItem(){

}

//Assigned to Yan
//loadItem Function will load data to Form for update when edit button clicked 
function loadItem(i){// i- index in items
    item = items[i];
    $("#name").val(item.name);
	$("#category").val(item.category);
    $("#price").val(item.price);
    $("#stock").val(item.stock);
    $("#description").val(item.description);
    isEdit = true;
}

//Assigned to Yan
//deleteItem Function will delete data 
function deleteItem(){
	$("#spinner").removeClass("hidden");
    // delete ajax call with item id 
	$.when($.ajax({
        url: "http://localhost:3000/products/"+item.id, 
        type: "DELETE"
    }))
    .done(function() { //reload 
        window.location.reload();
        $("#spinner").addClass("hidden");
    })
    .fail(function(e) {
        $("#spinner").addClass("hidden");
        alert("failure to delete changes");
    })
}

//Dialog Assigned to Minsu