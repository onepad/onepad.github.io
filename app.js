var firepad = null, userList = null, codeMirror = null;
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
    Cookies.set(confCookieName, JSON.stringify(config));
    console.log("config set");
    console.log(config);
}

function resetConfig() {
    setConfig(defaultconfig);
    $.modal.close();
    alert("config saved");
    window.location.reload();
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


function joinFirepadForHash() {
    console.log("joinFirepadForHash");
    if (firepad) {
        // Clean up.
        firepad.dispose();
        userList.dispose();
        $('.CodeMirror').remove();
    }

    var id = window.location.hash.replace(/#/g, '') || randomString(10);
    var url = window.location.toString().replace(/#.*/, '') + '#' + id;

    // load config from cookie
    var config = getConfig();
    // init firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    // var firepadRef = firebase.database().ref('demo').child(id);
    var firepadRef = firebase.database().ref().child(id);
    var userId = firepadRef.push().key; // Just a random ID.
    codeMirror = CodeMirror(document.getElementById('firepad'), {lineWrapping: true});
    firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
        {richTextToolbar: true, richTextShortcuts: true, userId: userId});
    userList = FirepadUserList.fromDiv(firepadRef.child('users'),
        document.getElementById('firepad-userlist'), userId);

    firepad.on('ready', function () {
        console.log("firepad ready");
        ensurePadInList(id);
        buildPadList();
    });

    codeMirror.focus();

    window.location = url;
    $('#url').val(url);
    $("#url").on('click', function (e) {
        $(this).focus().select();
        e.preventDefault();
        return false;
    });

    $('#setApiForm').on($.modal.BEFORE_OPEN, function (event, modal) {
        var config = getConfig();
        $("#currentapikey").text(config.apiKey);
        $("#currentdburl").text(config.databaseURL)
    });
}

function padListEnabled() {
    return (typeof localStorage !== 'undefined' && typeof JSON !== 'undefined' && localStorage.setItem &&
        localStorage.getItem && JSON.parse && JSON.stringify);
}

function ensurePadInList(id) {
    if (!padListEnabled()) {
        return;
    }
    var list = JSON.parse(localStorage.getItem('demo-pad-list') || "{ }");
    if (!(id in list)) {
        var now = new Date();
        var year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate();
        var hours = now.getHours(), minutes = now.getMinutes();
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        list[id] = [year, month, day].join('/') + ' ' + hours + ':' + minutes;

        localStorage.setItem('demo-pad-list', JSON.stringify(list));
        buildPadList();
    }
}

function buildPadList() {
    if (!padListEnabled()) {
        return;
    }
    $('#my-pads-list').empty();

    var list = JSON.parse(localStorage.getItem('onepad-list') || '{ }');
    for (var id in list) {
        $('#my-pads-list').append(
            $('<div></div>').addClass('my-pads-item').append(
                makePadLink(id, list[id])
            ));
    }
}

function makePadLink(id, name) {
    return $('<a></a>')
        .text(name)
        .on('click', function () {
            window.location = window.location.toString().replace(/#.*/, '') + '#' + id;
            $('#my-pads-list').hide();

            return false;
        });
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function onReady() {
    console.log("window ready");
    joinFirepadForHash();

    setTimeout(function () {
        $(window).on('hashchange', joinFirepadForHash);
    }, 0);

    waitForEl("#firepad-container .firepad-toolbar-wrapper", function () {
        $("#firepad-container .firepad-toolbar-wrapper").append("<div class=\"firepad-btn-group\"><a class=\"firepad-btn\" href=\"#setApiForm\" rel=\"modal:open\"><span class=\"firepad-tb-setconfig\">Config</span></a></div>");
        console.log("config button added");
    });
}

// $(window).on('ready', function () {
//     console.log("window ready");
//     joinFirepadForHash();
//
//     setTimeout(function () {
//         $(window).on('hashchange', joinFirepadForHash);
//     }, 0);
//
//     waitForEl("#firepad-container .firepad-toolbar-wrapper", function () {
//         $("#firepad-container .firepad-toolbar-wrapper").append("<div class=\"firepad-btn-group\"><a class=\"firepad-btn\" href=\"#setApiForm\" rel=\"modal:open\"><span class=\"firepad-tb-setconfig\">Config</span></a></div>");
//         console.log("config button added");
//     });
// });
