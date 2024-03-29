(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "time",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "stationvalue",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "landvalue",
            dataType: tableau.dataTypeEnum.string
        }];
    
        var tableSchema = {
            id: "GBMTemp",
            alias: "Global Mean Temperature",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };
    //myConnector.getSchema = function (schemaCallback) {
    //    tableau.log("Hello WDC!");
    //};

    myConnector.getData = function(table, doneCallback) {
        //$.getJSON("https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd0000019291e92e6c6b468c60143da10e24a86d&format=json&offset=0&limit=1500", function(resp) {
            $.getJSON("https://global-warming.org/api/temperature-api", function(resp) {  
            var feat = resp.result,
                tableData = [];
                tableau.log(feat.length)
             //Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "time": feat[i].time,
                    "stationvalue": feat[i].station,
                    "landvalue": feat[i].land
                });
                
            }
    
            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "Global Mean Temperature";
            tableau.submit();
        });
    });
})();
