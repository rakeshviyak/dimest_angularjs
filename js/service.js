//Uses firebase simpleauthenfication API to provide AUTH asynchronously. Session can store upto 30 days. 
//Use the anonymous login to authenticate. 
//$rootScope is used to broadcast the user info to other controllers when the async callback is returned.
//Other controller can listen to the rootscope broadcast message e.g. login or logout to perform operation
app.service('myAuthService', ["$rootScope","$route", function($rootScope,$route) {
    
    var ref = new Firebase('https://blinding-fire-2115.firebaseio.com/');
    this.auth = new FirebaseSimpleLogin(ref, function(error, user) {
        if (user) {
            console.log("Loginin In....");
            $rootScope.$emit("login", user);
            $route.reload();
        }
        else if (error) {
            $rootScope.$emit("loginError", error);
        }
        else {
            $rootScope.$emit("logout");
        }
    });
}]);