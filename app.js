var express = require('express');
var app = express();
var ldap = require('ldapjs');

app.listen(3000, function () {
    console.log("server started")
})

function authenticateDN(username, password){
    var client = ldap.createClient({
        url: 'ldap://127.0.0.1:10389'
    });

    client.bind(username, password, function(err) {
        if(err)
        {
            console.log("Error in new connetion "+err)
        }else {
            console.log("Success");

        }
    });
}

authenticateDN("uid=admin,ou=system","secret")