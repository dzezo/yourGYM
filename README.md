### Member Management API
**Load Metode**
```
.get('/member/:memberId')
```
* Out
```
{
    "_id": "5995d96dddaaa60f405f2237",
    "userId": "598e289edbb3940734e88a8f",
    "name": "Nikola Dzezo",
    "__v": 0,
    "memberships": [
        {
            "mName": "07-22 sa kardio programom",
            "start": "2017-08-17T00:00:00.000Z",
            "end": "2017-09-16T00:00:00.000Z",
            "daysLeft": 15,
            "length": 30,
            "cost": 3300,
            "debt": 1300,
            "_id": "5995d96dddaaa60f405f2238",
            "log": [
                {
                    "date": "2017-08-17T00:00:00.000Z",
                    "amount": 2000,
                    "_id": "5995d96dddaaa60f405f2239"
                }
            ]
        }
    ],
    "totalDebt": 1300,
    "email": "nikola@email.com",
    "phone": "060000111"
}
```
Pretrazi Clanove po imenu (rezultat prikazan je za :search = dzezo)
```
.get('/:userId/search/:search')
```
* Out
```
[
    {
        "name": "Nikola Dzezo",
        "debt": 1300,
        "start": "2017-08-17T00:00:00.000Z",
        "left": 15
    },
    {
        "name": "Vladan Dzezo",
        "debt": 3300,
        "start": "2017-08-17T00:00:00.000Z",
        "left": 15
    }
]
```
Dobavi sve clanove (sortirani po imenu)
```
.get('/:userId')
```
* Out
```
[
    {
        "name": "Nikola Dzezo",
        "debt": 1300,
        "start": "2017-08-17T00:00:00.000Z",
        "left": 15
    },
    {
        "name": "Petar Petrovic",
        "debt": 9600,
        "start": "2018-03-16T00:00:00.000Z",
        "left": 30
    },
    {
        "name": "Vladan Dzezo",
        "debt": 3300,
        "start": "2017-08-17T00:00:00.000Z",
        "left": 15
    }
]
```
Dobavi sve aktivne clanove (sortirani po datumu isteka)
```
.get('/active/:userId')
```
* Out
```
[
    {
        "name": "Nikola Dzezo",
        "debt": 1300,
        "start": "2017-08-17T00:00:00.000Z",
        "left": 15
    },
    {
        "name": "Vladan Dzezo",
        "debt": 3300,
        "start": "2017-08-17T00:00:00.000Z",
        "left": 15
    },
    {
        "name": "Petar Petrovic",
        "debt": 9600,
        "start": "2018-03-16T00:00:00.000Z",
        "left": 30
    }
]
```
Dobavi statistike teretane
```
.get('/:userId/statistics')
```
* Out
```
{
    "members": 3,
    "activeMembers": 3,
    "indeptedMembers": 3,
    "unpaidAmount": 14200
}
```
**Save Metode**
Dodavanje novog clana + inicijalna clanarina
```
.post('/:userId')
```
*Input
```
{
	"name": "Milan Mitrovic",
	"phone": opciono
	"email": opciono
	"start": "2017-08-17T00:00:00Z",
	"membershipId": "5993675ffd7ba61010678242",
	"amount": opciono
}
```
*Output
```
{ success: true, msg: 'New member added.' }
```
Dodavanje nove clanarine clanu :memberId
```
.post('/member/:memberId')
```
*Input
```
{
	"start": "2018-03-16T00:00:00Z",
	"membershipId": "59936683fd7ba6101067823e",
	"amount": opciono
}
```
*Output
```
{ success: true, msg: 'Membership created.' }
```
Dodavanje nove uplate clanu :memberId na ime clanarine :membershipId
```
.post('/member/:memberId/membership/:membershipId')
```
*Input
```
{
	"date": "2018-03-21T00:00:00Z",
	"amount": 10000
}
```
*Output
```
{ success: true, msg: 'Membership created.' }
```
**Delete Metode**
Obrisi clana
```
.delete('/member/:memberId')
```
Ponisti clanarinu clana
```
.delete('/member/:memberId/membership/:membershipId')
```
Ponisit uplatu na ime clanarine
```
.delete('/member/:memberId/membership/:membershipId/payment/:paymentId')
```
**Update Metode**
Izmeni podatke clana
```
.put('/member/:memberId')
```
*Input
```
{
	"name": "Mitors on Fire",
	"phone": "011 192 193",
	"email": "pe@dja.com"
}
```
Azuriraju preostale dane (date - trenutno vreme)
```
.put('/:userId')
```
*Input
```
{
	"date": "2017-09-01T00:00:00Z"
}
```

### Pricelist Management API
Pricelist(Cenovnik) sadrzi tipove clanarina. 

**Load Metode**
Dobavi kompletan cenovnik

```
.get(./pricelists/:userId)
```

Dobavi podatke itemId clanarine

```
.get(./pricelist/item/itemId)
```

**Save Metode**
Usnimi clanarinu

```
.post(./pricelists/:userId)
```
*Input
```
{
	"name": "07-22 sa kardio programom",
	"length": 210,
	"cost": 17400 
}
```
*Output
```
{
    "success": true,
    "msg": "New item saved."
}
```

**Delete Metode**
Obrisi itemId clanarinu

```
.delete(./pricelist/item/itemId)
```
*Output
```
{
    "success": true,
    "msg": "MY WELNESS 07-22 is removed."
}
```
**Update Metode**
Azuriranje itemId clanarine

```
.put(./pricelist/item/itemId)
```
*Input
```
{
	"name": "Zene - 07-22 sa kardio programom",
	"length": 30,
	"cost": 2500
}
```
*Output
```
{
    "success": true,
    "msg": "Zene - 07-22 sa kardio programom is now updated.",
    "item": {
        "_id": "599d992747856906e48de63e",
        "userId": "59932102eadabb0cec8178bc",
        "name": "Zene - 07-22 sa kardio programom",
        "length": 30,
        "cost": 2500,
        "__v": 0
    }
}
```