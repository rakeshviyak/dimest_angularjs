/**
*  Module
*
* Description
*/
var app=angular.module('dimestApp', ['ngRoute','firebase','components']);

//global variable to store the userid for the session
var currentUser;

//Declare firebase plugin URL
app.value('fbURL', 'https://blinding-fire-2115.firebaseio.com/');

//Routing Configuration
app.config(function($routeProvider){
  $routeProvider
    .when('/', {templateUrl: '/views/products.html', controller: 'ProductController'})
    .when('/new', {templateUrl: '/views/upload.html', controller: 'CreateController' })
    .when('/edit/:productId', {templateUrl: '/views/upload.html', controller: 'EditController' })
    .otherwise({ redirectTo:'/'});
});