var express = require('express');
var app = express();
var ldap = require('ldapjs');

app.listen(3000, function () {
    console.log("server started")
})
var client = ldap.createClient({
    url: 'ldap://127.0.0.1:10389'
});
function authenticateDN(username, password){


    client.bind(username, password, function(err) {
        if(err)
        {
            console.log("Error in new connetion "+err)
        }else {
            console.log("Success");
            //searchUser();
            //addUser();
            //deleteUser();
            //addUserToGroup('cn=Administrators,ou=groups,ou=system');
            deleteUserFromGroup('cn=Administrators,ou=groups,ou=system');

        }
    });
}

function searchUser()
{
    var opts = {
        //  filter: '(objectClass=*)',  //simple search
        //  filter: '(&(uid=2)(sn=John))',// and search
        filter: '(|(uid=2)(sn=John)(cn=Smith))', // or search
        scope: 'sub',
        attributes: ['sn']
    };
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

function addUser()
{
    var entry = {

        sn: 'bar',
        email: ['foo@bar.com', 'foo1@bar.com'],
        objectclass: 'inetOrgPerson'
    };
    client.add('cn=foo12,ou=users,ou=system', entry, function(err) {
        if(err)
        {
            console.log("err in new user "+err);
        }else
        {
            console.log("added user")
        }
    });
}

function deleteUser()
{
    client.del('cn=foo1,ou=users,ou=system', function(err) {
        if(err)
        {
            console.log("err in delete new user "+err);
        }else
        {
            console.log("deleted user")
        }
    });
}

function addUserToGroup(groupname)
{
    var change = new ldap.Change({
        operation: 'add',
        modification: {
            uniqueMember: 'cn=jill,ou=users,ou=system'
        }
    });

    client.modify(groupname, change, function(err) {
        if(err)
        {
            console.log("err in add user in a group "+err);
        }else
        {
            console.log("added user in a group")
        }
    });
}

function deleteUserFromGroup(groupname)
{

    var change = new ldap.Change({
        operation: 'delete',
        modification: {
            uniqueMember: 'cn=hiii,ou=users,ou=system'
        }
    });

    client.modify(groupname, change, function(err) {
        if(err)
        {
            console.log("err in delete  user in a group "+err);
        }else
        {
            console.log("deleted  user from a group")
        }
    });
}

authenticateDN("uid=admin,ou=system","secret")