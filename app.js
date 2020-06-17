const defaultconfig = {
    apiKey: 'AIzaSyAAjpX__jctYv_EB0DLr07zZN9u0Z5IBMA',
    // apiKey: "test",
    authDomain: "onepad.github.io",
    databaseURL: "https://onepadeditor.firebaseio.com"
};
const confCookieName = "fconf";

function getConfig() {
    var config = Cookies.getJSON(confCookieName);
    console.log("saved config: ", config);
    if (config == undefined || config.apiKey == undefined || config.apiKey == undefined || config.apiKey == "") {
        console.log("using default config");
        config = defaultconfig;
        setConfig(config);
    } else {
        console.log("using saved config");
    }
    console.log(config);
    return config;
}

function setConfig(config) {
    if (config == undefined || config.apiKey == undefined) {
        return
    }
    Cookies.set(confCookieName, JSON.stringify(config), { expires: 360 });
    console.log("config set");
    console.log(config)
}

function submitConfig() {
    var apiKey = $("#setapiapikey").val();
    var databaseUrl = $("#setapidatabaseurl").val();
    if (apiKey != "" && apiKey != undefined && databaseUrl != "" & databaseUrl != undefined) {
        var config = {
            // apiKey: 'AIzaSyAAjpX__jctYv_EB0DLr07zZN9u0Z5IBMA',
            apiKey: apiKey,
            authDomain: "onepad.github.io",
            databaseURL: databaseUrl
        };
        setConfig(config);
    }
    $.modal.close();
    alert("config saved");
    window.location.reload();
}

var waitForEl = function (selector, callback) {
    if (jQuery(selector).length) {
        callback();
    } else {
        setTimeout(function () {
            waitForEl(selector, callback);
        }, 100);
    }
};

waitForEl("#firepad-container .firepad-toolbar-wrapper", function () {
    $("#firepad-container .firepad-toolbar-wrapper").append("<div class=\"firepad-btn-group\"><a class=\"firepad-btn\" href=\"#setApiForm\" rel=\"modal:open\"><span class=\"firepad-tb-setconfig\">Config</span></a></div>")
});

// Helper to get hash from end of URL or generate a random one.
function getExampleRef() {
    var ref = firebase.database().ref();
    var hash = window.location.hash.replace(/#/g, '');
    if (hash) {
        ref = ref.child(hash);
    } else {
        ref = ref.push(); // generate unique location.
        window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
    }
    if (typeof console !== 'undefined') {
        console.log('Firebase data: ', ref.toString());
    }
    return ref;
}