var sortBy;
var orderBy;
var isEdit = false;
var items;	  // For whole data
var item;     // For selected item
var dateS;
var date;
var dateInHTML;
var result;
var postJson;

//Sorting and Visual Effects Assigned to Minsu
$(function () {
	readProducts(sortBy, orderBy);
    $('.sort').change(function (){
        sortBy = $("#sortBy").val();
        orderBy = $("#orderBy").val();
        readProducts(sortBy, orderBy);
    });

    //validation to input only digits and generate , thousand
    $('#price').keyup(function(event) {
        // skip for arrow keys
        if(event.which >= 37 && event.which <= 40) return;
        // format number
        $(this).val(function(index, value) {
            return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
        });
    });

    $('#stock').keyup(function(event) {
        // skip for arrow keys
        if(event.which >= 37 && event.which <= 40) return;
        // format number
        $(this).val(function(index, value) {
            return value
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
        });
    });

    var fileTarget = $('.filebox .upload-hidden');

    //http://stackoverflow.com/questions/4851595/how-to-resolve-the-c-fakepath
    //fakepath problem resolved
    fileTarget.on('change', function(){
        if(window.FileReader){
            // get file name
            filename = $(this)[0].files[0].name;
        } 

        else {
            // get file name for Old IE 
            filename = $(this).val().split('/').pop().split('\\').pop();
        };

        $(this).siblings('.upload-name').val(filename);
    });

    //preview image 
    var imgTarget = $('.preview-image .upload-hidden');

    imgTarget.on('change', function(){
        var parent = $(this).parent();
        parent.children('.upload-display').remove();

        if(window.FileReader){
            //only image file
            if (!$(this)[0].files[0].type.match(/image\//)) return;
            
            var reader = new FileReader();
            reader.onload = function(e){
                var src = e.target.result;
                parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img src="'+src+'" class="upload-thumb"></div></div>');
            }
            reader.readAsDataURL($(this)[0].files[0]);
        }

        else {
            $(this)[0].select();
            $(this)[0].blur();
            var imgSrc = document.selection.createRange().text;
            parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img class="upload-thumb"></div></div>');

            var img = $(this).siblings('.upload-display').find('img');
            img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";        
        }
    });
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
    date = new Date();
    postJson = new Object(); // this object need for new data but, post manage exist data.
        postJson.name = $("#name").val();
        postJson.description = $("#description").val();
        postJson.category = $("#category").val();
        postJson.price = $("#price").val(); if (postJson.price == "") { postJson.price = "0"} 
        postJson.stock = $("#stock").val(); if (postJson.stock == "") { postJson.stock = "0"} 
        postJson.image = filename;
        postJson.date = date;
        result = JSON.stringify(postJson);

    var itemName = $("#name").val();
    var itemDescription = $("#description").val();

    if(itemName != null && itemName != "" && itemDescription != null && itemDescription != "")
    {
        $("#spinner").removeClass("hidden");
        if(isEdit == true)
        {
            item.name = $("#name").val();
            item.description = $("#description").val();
            item.category = $("#category").val();
            item.price = $("#price").val();
            item.stock = $("#stock").val();
            item.image = filename;
            item.date = date;
            //alert(JSON.stringify(item));
            
            $.when($.ajax({
                url: "http://localhost:3000/products/"+item.id, 
                type: "PATCH",
                contentType: "application/json",
                data: JSON.stringify(item),
            }))
            .done(function() {
                window.location.reload();
                $("#spinner").addClass("hidden");
            })
            .fail(function(e) {
                $("#spinner").addClass("hidden");
                alert("failure to update changes");
            })

        } // Update
        else{
            $.when($.ajax({
                url: "http://localhost:3000/products/", 
                type: "POST",
                contentType: "application/json",
                data: result,
                dataType:"JSON",
            }))
            .done(function() {
                window.location.reload();
                $("#spinner").addClass("hidden");
            })
            .fail(function(e) {
                $("#spinner").addClass("hidden");
                alert("failure to save changes");
            })

        } // create
    }
    else
    {
        alert("Please check your input.");
    }

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
function delItem(i){
    $("#delete-dialog").dialog({
        show: {effect: "fade", speed: 1000},
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete Item": function() {
                deleteItem();
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });
    item = items[i];
    $("#delete-dialog").dialog("open");
}