(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "country",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "state",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "city",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "station",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "last_update",
            dataType: tableau.dataTypeEnum.datetime
        },{
            id: "pollutant_id",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "pollutant_min",
            alias: "pollutant_min",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "pollutant_max",
            alias: "pollutant_max",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "pollutant_avg",
            alias: "pollutant_avg",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "pollutant_unit",
            dataType: tableau.dataTypeEnum.string
        }];
    
        var tableSchema = {
            id: "AirQualityIndex",
            alias: "Real time Air Quality Index from various location",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };
    //myConnector.getSchema = function (schemaCallback) {
    //    tableau.log("Hello WDC!");
    //};

    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd0000019291e92e6c6b468c60143da10e24a86d&format=json&offset=0&limit=1500", function(resp) {
            var feat = resp.records,
                tableData = [];
                tableau.log(feat.length)
             //Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].id,
                    "country": feat[i].country,
                    "state": feat[i].state,
                    "city": feat[i].city,
                    "station": feat[i].station,
                    "last_update": feat[i].last_update,
                    "pollutant_id": feat[i].pollutant_id,
                    "pollutant_min": feat[i].pollutant_min,
                    "pollutant_max": feat[i].pollutant_max,
                    "pollutant_avg": feat[i].pollutant_avg,
                    "pollutant_unit":feat[i].pollutant_unit
                });
                
            }
    
            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "WDC Air Quaity Index";
            tableau.submit();
        });
    });
})();
