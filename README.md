# README #

Get the ICTS-Telephone app up and running for [development](#development-setup) or for [production](#production-setup).

## What is this repository for? ##

* University of Twente (UTwente) ICT Service department (ICTS) telephone application
    * Import of Tele2 callviewer (csv) and T-Mobile callviewers (csv)
    * Manual import of KPN callviewer
    * Customer management
    * On-charged mobile telephone expenses
    * On-charged mobile landline expenses (Microsoft Lync & PABX)
    * Expense analysis
    * Financial export file for DOT (.dot)

## Development setup ##

For more information see the [wiki](https://github.com/utwente/icts-telefonie/wiki/dev-installation-of-prerequisites)

#### Start app (development) ####
##### Start MongoDB #####
* Run 'mongod.exe' from terminal
```
$ C:/var/mongodb/bin/mongod.exe
```

##### Configure LDAP settings #####
* In the folder icts-telefonie/server/config
    * Copy the file local.env.sample.js to local.env.js
    * Enter LDAP_OPTIONS values

##### Start app #####
Leave this window open, open a **new terminal** for the other command(s):
```
$ grunt serve
```

## Production setup ##

-To be updated-

## Contribution guidelines ##

-To be updated-
* Writing tests
* Code review
* Other guidelines

## Who do I talk to? ##

* Developers: Brian Diephuis & Floriaan Post
