//Query the products stored in firebase based the productIdUrl. If the productIdUrl query all the products stored 
app.factory('Products', function($firebase, fbURL) {
  return function(productIdUrl){
    finalURL=fbURL+productIdUrl;
    console.log(finalURL);
    return $firebase(new Firebase(finalURL));
  };
});

//ProductCart to add or remove the products in the store. Uses the currentUser session id to persist the products in the store.
app.factory('ProductCart',function(Products){
  return function(product,productId,cartFlag,cartValue){
    product = Products(productId);
    console.log(product);
    var userString=currentUser+",";
    if(cartFlag===true){
      product.cart=cartValue+userString;
    }else{
      product.cart=cartValue.split(userString).join("");
    }
    product.$save('cart');
    console.log(product);
  };
});


app.factory('ProductTypes',function(){
  var producttypes=[
    {name:'Music/mp3', class:'music-mp3', title:'Music'},
    {name:'Video/flv', class:'video-flv', title:'Video'},
    {name:'Ebook/pdf', class:'ebook-pdf', title:'Ebook'},
    {name:'Image/PNG', class:'image-png', title:'Other'},
  ];
  return producttypes;
});
