////////////////////////////////////////////////////////////////////////////////
//
// Rename this file to certidLogin.js and make changes below.
//
// To configure Certification ID widget set the following below:
// 		url - This is the URL to the Certification IDs service.
//					http://hostname:port/rest/certification_ids/
//
// 		apiKey - This is the API key from the Open CHPL website.
//
////////////////////////////////////////////////////////////////////////////////

var chplCertIdWidgetLogin = (function(){
	return {
		setup: function() {
			chplCertIdWidget.setUrl("rest\/certification_ids\/");
			chplCertIdWidget.setApiKey("6584d39cc02587e4a6083981344aa9a0");
		}
	}
}());
