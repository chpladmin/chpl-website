var urlCertId = "http:\/\/localhost:8080\/chpl-service\/certificationids\/getCertificationId";
var apiKey = "myapikey";
var cookiePath = "/";
var cookieCertificationIdData = "certiddata";
var cookieProducts = "products";

$(document).ready(function() {
	invokeGetCertificationId();
});

////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////
function invokeGetCertificationId(addIds,removeIds) {
	updateButtonAndId(false);

	// Get products currently in cart
	var productIds = [];
	var prods = getProductsInCart()
	prods.forEach(function(item,index) {
		productIds.push(item.productId);
	});

	// Add products to the list
	if ((null != addIds) && ("undefined" != addIds)) {
		productIds = productIds.concat(addIds);
	}

	// Create formatted string if product Ids
	var productIdsString = "";
	productIds.forEach(function (item, index) {
		if (("undefined" != item) && ((null == removeIds) || ("undefined" == removeIds) || (-1 == removeIds.indexOf(item)))) {
			if (productIdsString.length > 0)
				productIdsString += "|";
			productIdsString += item;
		}
	});

	// TODO Only show if it is explicitly requested by the user.
	var certificationIdRequestedByUser = true;

	// Call API to attempt to get an EHR Certification ID
	$.ajax({
		url: urlCertId,
		type: "GET",
		cache: false,
		headers: {"API-KEY": apiKey},
		data: "products=" + productIdsString,
		success: function(data, status, xhr) {
			setCookie(cookieCertificationIdData, JSON.stringify(data), 365);
			displayCertificationIdResults(certificationIdRequestedByUser);
		},
		error: function(xhr, status, error) {
			displayCertificationIdResults(certificationIdRequestedByUser);
			alert(status + ": " + error);
		}
	});
}

////////////////////////////////////////////////////////////////
// displayCertificationIdResults
//
////////////////////////////////////////////////////////////////
function displayCertificationIdResults(certificationIdRequestedByUser) {

	var data = JSON.parse(getCookie(cookieCertificationIdData));
	if (!data || "undefined" == data) {
		return;
	} else {
		
		// Update the ID text and hide it until the button is clicked
		$("#certId").text(data.ehrCertificationId);
		updateButtonAndId(false);
		
		var crit = 0;
		var inp = 0;
		var amb = 0;
		var dom = 0;
		
		if ((null != data) && (null != data.metPercentages)) {
			crit = data.metPercentages["criteriaMet"];
			inp = data.metPercentages["cqmsInpatient"];
			amb = data.metPercentages["cqmsAmbulatory"];
			dom = data.metPercentages["cqmDomains"];
		}
		
		$("#baseCriteriaPercentage").text( crit + "%");
		$("#inpatientCqmsPercentage").text( inp + "%");
		$("#ambulatoryCqmsPercentage").text( amb + "%");
		$("#domainsPercentage").text( dom + "%");
	}

	displayProducts();
}

function updateButtonAndId(showIdRequested) {
	var data = JSON.parse(getCookie(cookieCertificationIdData));
	if (null != data) {
		isValid = data.isValid;
	} else {
		isValid = false;
	}
	
	// Check whether to show ID or the button
	if (showIdRequested) {
		if (isValid) {
			$("#btnEhrGetCertificationId").prop('disabled', false);
			$("#btnEhrGetCertificationId").hide();
			$(".widgetcertidbar").show();
		} else {
			$("#btnEhrGetCertificationId").prop('disabled', true);
			$("#btnEhrGetCertificationId").show();
			$(".widgetcertidbar").hide();
		}
	} else {
		if (isValid) {
			$("#btnEhrGetCertificationId").prop('disabled', false);
			$("#btnEhrGetCertificationId").show();
			$(".widgetcertidbar").hide();
		} else {
			$("#btnEhrGetCertificationId").prop('disabled', true);
			$("#btnEhrGetCertificationId").show();
			$(".widgetcertidbar").hide();
		}
	}

	}

////////////////////////////////////////////////////////////////
// Retrieves the value of a specified cookie
//
////////////////////////////////////////////////////////////////
function getCookie(name) {
	var cookies = document.cookie.split(";");
	for (var i=0; i < cookies.length; ++i) {
		if (name == ( (cookies[i].split("=")[0]).trim() )) {
			var value = (cookies[i].split("=")[1]).trim();
			return value;
		} 
	}
	return null;
}

////////////////////////////////////////////////////////////////
// Stores the value of a specified cookie
//
////////////////////////////////////////////////////////////////
function setCookie(cname, cvalue, exdays) {
	var expires = null;
	if (-1 != exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		expires = "expires="+d.toUTCString();
	}
	var cookieString = cname + "=" + cvalue + ((-1 != exdays) ? ("; " + expires) : ("")); 
	document.cookie = cookieString + "; path=" + cookiePath;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getProductsInCart() {
	var prods = [];
	var data = getCookie(cookieCertificationIdData);
	if (null == data || "undefined" == data || "" == data) {
		console.log("getProductsInCart: No certification id data to retrieve.");
	} else {
		prods = JSON.parse(data)["products"];
	}
	return prods;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
function setProductsInCart(products) {
	var data = getCookie(cookieCertificationIdData);
	if (null == data || "undefined" == data || "" == data) {
		console.log("setProductsInCart: No certification id data to retrieve.");
	} else {
		data["products"] = products;
		setCookie(cookieCertificationIdData, data, 365);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getProductCount() {
	var count = 0;
	var prods = getProductsInCart()
	for (var number in prods) {
		if (prods.hasOwnProperty(number)) {
			count++;
		}
	}
	return count;					
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
function removeProductFromCart(id) {
	invokeGetCertificationId(null, [id]);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
function addProductToCart(id) {
	invokeGetCertificationId([id], null);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
function isProductInCart(id) {
	var prods = getProductsInCart();
	for (var index = 0; index < prods.length; ++index) {
		if (id == prods[index].productId) {
			return true;
		}
	}
	return false;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
function displayProducts() {
	var data = getCookie(cookieCertificationIdData);

	// Add products listing
	if (null != data && "undefined" != data) {
		
		var products = JSON.parse(data)["products"];
		if ("undefined" != products && products.length > 0) {
		
			// Empty the product list except for the template
			$("#selectedProductsList li:not([id=productListItemTemplate])").remove();
			
			$.each(products, function(index, item) {
				var listItem = $("#productListItemTemplate").clone(true);
				listItem.removeAttr("id");
				listItem.find("button").attr("title", item.name);
				listItem.find("button").text(item.name);
				var btnId = "btnChplProduct_" + item.productId;
				listItem.find("button").attr("id", btnId);
				listItem.show();
				$("#selectedProductsList").append(listItem);
				$("#" + btnId).click(function() {
					removeProductFromCart(item.productId);
				});
			});
			$("#txtNoProductsSelected").hide();
			$("#selectedProductsList").show();
			return;
		}
	}
	$("#selectedProductsList").hide();
	$("#txtNoProductsSelected").show();
}
