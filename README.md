## Run Server:
``` node server.js ```
#### NOTE: The resident dashboard has been moved to:
Updated repo is now @ bit.ly/trovedashboard

#### NOTE: You must be on the Cornell VPN to utilize this web api

## WEB API:
To obtain all of the radiologists, do a GET request to http://[IP]/num_ext/resident_dash/getRadiologists.

i.e.
```
$http({method: 'GET', timeout: 30000, url: 'http://[IP]/num_ext/resident_dash/getRadiologists'})
.success(function(radiologist_data, status, headers, config) {
    $scope.radiologists = radiolgist_data;
});
```

Radiologist data will come in an array of objects pertaining to a radiologist.

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

To obtain all of the orders associated with a radiologist, you do a POST request to http://[IP]/num_ext/resident_dash/getOrders.

The API requires that you give a **from_date** and a **to_date** to specify a time period for the report query.

You also need to provide the **primary key** of the radiologist associated with the query.

i.e.
```
$http({method: 'POST', timeout: 30000, url: 'http://[IP]/num_ext/resident_dash/getOrders',
  data:{
    //  "YYYY-MM-DD" --> 2013-12-01
    from_date:<string>,
    //  "YYYY-MM-DD" --> 2014-02-01
    to_date:<string>,
    radiologist_pk:<int>
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
  // report string
  <string>,
  ...
]
```

The report's newlines are denoted with '|' which should be processed appropriately by the user. An example can be seen app.js.
