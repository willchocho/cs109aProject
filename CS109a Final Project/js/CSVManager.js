CSVManager = function(_directory){
    this.directory = _directory;

    this.importCSV();
};

CSVManager.prototype.importCSV = function() {
    manager = this;

    d3.csv(this.directory, function(error,data) {
        if (!error) {
            manager.data = data;
            manager.wrangleData();
        }
        else {
            console.log("Error importing CSV");
            console.log(error);
        }
    });
};

CSVManager.prototype.wrangleData = function() {
    manager = this;

    manager.data.forEach(function(d){
        keys = d3.map(d, function(f){return f;}).keys();

        keys.forEach(function(key) {
            d.key = d.key;
        });
    });
};

CSVManager.prototype.getData = function() {
    return this.data;
};