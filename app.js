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
    var opts = {
        //  filter: '(objectClass=*)',  //simple search
        //  filter: '(&(uid=2)(sn=John))',// and search
        filter: '(|(uid=2)(sn=John)(cn=Smith))', // or search
        scope: 'sub',
        attributes: ['sn']
    };
    client.bind(username, password, function(err) {
        if(err)
        {
            console.log("Error in new connetion "+err)
        }else {
            console.log("Success");
            client.search('ou=users,ou=system', opts, function(err, res) {
                if(err)
                {
                    console.log("Error in search "+err)
                }else {
                    res.on('searchEntry', function(entry) {
                        console.log('entry: ' + JSON.stringify(entry.object));
                    });
                    res.on('searchReference', function(referral) {
                        console.log('referral: ' + referral.uris.join());
                    });
                    res.on('error', function(err) {
                        console.error('error: ' + err.message);
                    });
                    res.on('end', function(result) {
                        console.log('status: ' + result.status);
                    });
                }


            });
        }
    });
}

authenticateDN("uid=admin,ou=system","secret")