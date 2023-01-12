(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "Datestring",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Date",
            alias: "Date",
            dataType: tableau.dataTypeEnum.string
        }/*, {
            id: "title",
            alias: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "location",
            dataType: tableau.dataTypeEnum.string
        }*/
    ];

        var tableSchema = {
            id: "Calender",
            alias: "Calender",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };
    Date.prototype.addDays = function(days) {
        var dat = new Date(this.valueOf())
        dat.setDate(dat.getDate() + days);
        return dat;
    }
 
    function getDates(startDate, stopDate) {
       var dateArray = new Array();
       var currentDate = startDate;
       
       while (currentDate <= stopDate) {
         dateArray.push(currentDate)
         currentDate = currentDate.addDays(1);
       }
       return dateArray;
     }

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        
        $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
            var feat = resp.features,
            tableData = [];
            //jsonData=["bill", "bob", "karen", "sue"];
            var dateObj = JSON.parse(tableau.connectionData),
            d = new Date(dateObj.startyear+"-01-01");
            d1 = new Date(dateObj.endyear+"-12-31");
            var dateArray = getDates(d, d1);
            const dateJson = JSON.stringify(Object.assign({"Date": dateArray}));
            // Iterate over the JSON object
            for (var i = 0, len = dateArray.length /*jsonData.length*/; i < len; i++) {
                tableData.push({
                    "Datestring": dateArray[i],
                    "Date": dateArray[i].toLocaleDateString('en-US')//,
                    //"title": jsonData[i].usernames,
                    //"location": jsonData[i].usernames
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        
        $("#submitButton").click(function() {
            var dateObj = {
                startyear: $('#start-year').val().trim(),
                endyear: $('#end-year').val().trim()
            };
            
            
            // Simple date validation: Call the getDate function on the date object created
            function isValidDate(sy , ey) {
                //var d = new Date(dateStr);
                //return !isNaN(d.getDate());
                var result=false;
                if (sy !=="" && ey !=="" && sy<=ey) {
                    result=true
                };
                return result;   
            };
            
            if (isValidDate(dateObj.startyear , dateObj.endyear)) {
                $('#errorMsg').html("");
                tableau.connectionData = JSON.stringify(dateObj);
                tableau.connectionName = "Calender"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
                
            } else {
               
                $('#errorMsg').html("Enter Proper Year!!!");
                
            }
        });
    });
})();