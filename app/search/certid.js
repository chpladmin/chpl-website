////////////////////////////////////////////////////////////////////////////////
// This is the javascript controller module for the CHPL Widget.
// The widget requires cookies to function.
//
// To initialized the CHPL Widget, make a call similar to the following:
//
// $(document).ready(function() {
// 	chplCertIdWidget.invokeGetCertificationId(null, null, false);
// });
//
////////////////////////////////////////////////////////////////////////////////

var chplCertIdWidget = (function(){
	
	var urlCertId = "http:\/\/localhost:8080\/chpl-service\/certification_ids\/";
	var apiKey = "myapikey";
	var cookiePath = "/";
	var cookieCertificationIdData = "certiddata";
	var cookieProducts = "products";

	return {
		////////////////////////////////////////////////////////////////
		//
		////////////////////////////////////////////////////////////////
		invokeGetCertificationId: function (addIds,removeIds,create) {
			chplCertIdWidget.updateButtonAndId(false);
			
			if ((null === create) || ("undefined" === create)) {
				create = false;
			}

			// Get products currently in cart
			var productIds = [];
			var prods = chplCertIdWidget.getProductsInCart()
			prods.forEach(function(item,index) {
				productIds.push(item.productId);
			});

			// Add products to the list
			if ((null !== addIds) && ("undefined" !== addIds)) {
				productIds = productIds.concat(addIds);
			}

			// Create formatted string if product Ids
			var productIdsString = "";
			productIds.forEach(function (item, index) {
				if (("undefined" !== item) && ((null === removeIds) || ("undefined" === removeIds) || (-1 === removeIds.indexOf(item)))) {
					if (productIdsString.length > 0)
						productIdsString += "|";
					productIdsString += item;
				}
			});

			// Call API to attempt to get an EHR Certification ID
			$.ajax({
				url: urlCertId,
				type: "GET",
				cache: false,
				headers: {"API-KEY": apiKey},
				data: "products=" + productIdsString + "&create=" + create,
				success: function(data, status, xhr) {
					chplCertIdWidget.setCookie(cookieCertificationIdData, JSON.stringify(data), 365);
					chplCertIdWidget.displayCertificationIdResults(create);
				},
				error: function(xhr, status, error) {
					chplCertIdWidget.displayCertificationIdResults(false);
					alert(status + ": " + error);
				}
			});
		},

		////////////////////////////////////////////////////////////////
		// displayCertificationIdResults
		//
		////////////////////////////////////////////////////////////////
		displayCertificationIdResults: function (create) {

			var data = JSON.parse(chplCertIdWidget.getCookie(cookieCertificationIdData));
			if (!data || "undefined" === data) {
				return;
			} else {
				
				// Update the ID text and hide it until the button is clicked
				$("#certId").text(data.ehrCertificationId);
				chplCertIdWidget.updateButtonAndId(create);
				
				var crit = 0;
				var inp = 0;
				var amb = 0;
				var dom = 0;
				
				if ((null !== data) && (null !== data.metPercentages)) {
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

			chplCertIdWidget.displayProducts();
		},
		
		revealId: function () {
			chplCertIdWidget.invokeGetCertificationId(null, null, true);
			chplCertIdWidget.updateButtonAndId(true);
		},

		updateButtonAndId: function (showIdRequested) {
			var data = JSON.parse(chplCertIdWidget.getCookie(cookieCertificationIdData));
			var isValid = false;
			var year = null;
			if (null !== data) {
				isValid = data.isValid;
				year = data.year;
			} else {
				isValid = false;
				year = null;
			}

			if (null !== year) {
				$("#btnEhrGetCertificationId").text("Get " + data.year + " EHR Certification ID");
			} else {
				$("#btnEhrGetCertificationId").text("Get EHR Certification ID");
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
		},

		////////////////////////////////////////////////////////////////
		// Retrieves the value of a specified cookie
		//
		////////////////////////////////////////////////////////////////
		getCookie: function (name) {
			var cookies = document.cookie.split(";");
			for (var i=0; i < cookies.length; ++i) {
				if (name === ( (cookies[i].split("=")[0]).trim() )) {
					var value = (cookies[i].split("=")[1]).trim();
					return value;
				} 
			}
			return null;
		},

		////////////////////////////////////////////////////////////////
		// Stores the value of a specified cookie
		//
		////////////////////////////////////////////////////////////////
		setCookie: function (cname, cvalue, exdays) {
			var expires = null;
			if (-1 !== exdays) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				expires = "expires="+d.toUTCString();
			}
			var cookieString = cname + "=" + cvalue + ((-1 !== exdays) ? ("; " + expires) : ("")); 
			document.cookie = cookieString + "; path=" + cookiePath;
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		getProductsInCart: function () {
			var prods = [];
			var data = chplCertIdWidget.getCookie(cookieCertificationIdData);
			if (null === data || "undefined" === data || "" === data) {
				console.log("getProductsInCart: No certification id data to retrieve.");
			} else {
				prods = JSON.parse(data)["products"];
			}
			return prods;
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		setProductsInCart: function (products) {
			var data = chplCertIdWidget.getCookie(cookieCertificationIdData);
			if (null === data || "undefined" === data || "" === data) {
				console.log("setProductsInCart: No certification id data to retrieve.");
			} else {
				data["products"] = products;
				chplCertIdWidget.setCookie(cookieCertificationIdData, data, 365);
			}
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		getProductCount: function () {
			var count = 0;
			var prods = chplCertIdWidget.getProductsInCart()
			for (var number in prods) {
				if (prods.hasOwnProperty(number)) {
					count++;
				}
			}
			return count;					
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		removeProductFromCart: function (id) {
			chplCertIdWidget.invokeGetCertificationId(null, [id], false);
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		addProductToCart: function (id) {
			chplCertIdWidget.invokeGetCertificationId([id], null, false);
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		isProductInCart: function (id) {
			var prods = chplCertIdWidget.getProductsInCart();
			for (var index = 0; index < prods.length; ++index) {
				if (id === prods[index].productId) {
					return true;
				}
			}
			return false;
		},

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		displayProducts: function () {
			var data = chplCertIdWidget.getCookie(cookieCertificationIdData);

			// Add products listing
			if (null !== data && "undefined" !== data) {
				
				var products = JSON.parse(data)["products"];
				if ("undefined" !== products && products.length > 0) {
				
					// Empty the product list except for the template
					$("#selectedProductsList li:not([id=productListItemTemplate])").remove();
					
					$.each(products, function(index, item) {
						var listItem = $("#productListItemTemplate").clone(true);
						listItem.removeAttr("id");
						listItem.find("button").attr("title", item.name);
						listItem.find("[name='title']").text(item.name);
						var btnId = "btnChplProduct_" + item.productId;
						listItem.find("button").attr("id", btnId);
						listItem.show();
						$("#selectedProductsList").append(listItem);
						$("#" + btnId).click(function() {
							chplCertIdWidget.removeProductFromCart(item.productId);
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
	}
}());

$(document).ready(function() {
	chplCertIdWidget.invokeGetCertificationId(null, null, false);
});
