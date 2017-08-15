### Member Management API

### Pricelist Management API
Pricelist(Cenovnik) sadrzi tipove clanarina. 

**Load Metode**
Dobavi kompletan cenovnik

```
get.(./pricelists/:userId)
```

Dobavi podatke Pricelist clanarine

```
get.(./pricelists/:userId/pricelist/pricelistId)
```

**Save Metode**
Usnimi clanarinu

```
post.(./pricelists/:userId)
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
Obrisi pricelistId clanarinu

```
delete.(./pricelists/:userId/pricelist/pricelistId)
```
*Output
```
{
    "success": true,
    "msg": "MY WELNESS 07-22 is removed."
}
```
**Update Metode**
Azuriranje pricelistId clanarine

```
put.(./pricelists/:userId/pricelist/pricelistId)
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
    "msg": "Zene - 07-22 sa kardio programom is now updated."
}
```