const defaultconfig = {
    // apiKey: 'AIzaSyAAjpX__jctYv_EB0DLr07zZN9u0Z5IBMA',
    apiKey: "test",
    authDomain: "onepad.github.io",
    databaseURL: "https://onepadeditor.firebaseio.com"
};

function btnConfig(config) {
    $("#overlay").show();
    if (config == undefined) {
        config = defaultconfig;
    }
    Cookies.set("fconf", JSON.stringify(config));
    console.log("config set");
    console.log(config)
}

function btnSetConfigForm() {
$("body").append("<div class=\"firepad-dialog\" id=\"overlay\"><div class=\"firepad-dialog-div\"><input class=\"firepad-dialog-input\" id=\"img\" type=\"text\" placeholder=\"Insert Firebase Api Key\" autofocus=\"autofocus\"><div class=\"firepad-btn-group\"><a class=\"firepad-btn\" id=\"submitbtn\">Submit</a><a class=\"firepad-btn\">Cancel</a></div></div></div>")
}