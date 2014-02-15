##h2 NOTE: You must be on the Cornell VPN to utilize this web api

##h2 WEB API:
To obtain all of the radiologists, do a GET request to http://10.177.152.33/num_ext/resident_dash/getRadiologists

i.e.
```
$http({method: 'GET', timeout: 30000, url: 'http://10.177.152.33/num_ext/resident_dash/getRadiologists'})
.success(function(radiologist_data, status, headers, config) {
    $scope.radiologists = radiolgist_data;
});
```

Radiologist data will come in an array of objects pertaining to a radiologist
The array object will be of the form:

```
[
  {
    // primary key
    pk: <int>,
    fields: {
      // first name
      fname: <string>,
      lname: <string>
      ... misc fields
    }
  },
  {
  ...
  }
]
```

To obtain all of the orders associated with a radiologist, you do a POST request to http://10.177.152.33/num_ext/resident_dash/getOrders

i.e.
```
$http({method: 'POST', timeout: 30000, url: 'http://10.177.152.33/num_ext/resident_dash/getOrders',
  data:{
    //  "YYYY-MM-DD" --> 2013-12-01
    from_date:<string>,
    //  "YYYY-MM-DD" --> 2014-02-01
    to_date:<string>,
    radiologist_pk:int
  }
})
.success(function(reports_data) {
  $scope.reports = reports_data;
});
```

Radiologist report data will come in an array of objects pertaining to the query given.
The returned array will contain objects of the form:

```
[
  // report string containing embedded html
  <string>,
  ...
]
```
