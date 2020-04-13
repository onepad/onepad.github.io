const defaultconfig = {
    // apiKey: 'AIzaSyAAjpX__jctYv_EB0DLr07zZN9u0Z5IBMA',
    apiKey: "test",
    authDomain: "onepad.github.io",
    databaseURL: "https://onepadeditor.firebaseio.com"
};

function btnConfig(config) {
    if (config == undefined) {
        config = defaultconfig;
    }
    Cookies.set("fconf", JSON.stringify(config));
    console.log("config set");
    console.log(config)
}
