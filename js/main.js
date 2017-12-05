var allData;
var genderGraph;
var controlGraph, patientGraph;
var histogram;

d3.csv("data/ADNIMERGE.csv", function(error,data) {
    if (!error) {
        allData = data;
        wrangleData();
    }
    else {
        console.log("Error importing CSV");
        console.log(error);
    }

    fullWidth = $("#general-chart-area").width();

    genderGraph = new CatBarGraph(allData,"general-chart-area","generalColLabel","PTGENDER","Sex",fullWidth,fullWidth/3);
    controlData = filterDataExcl("DX_bl","AD");
    controlGraph = new CatBarGraph(controlData,"control-chart-area","diagnosisColLabel","PTGENDER","Sex",fullWidth/2,fullWidth/3);
    patientData = filterDataIncl("DX_bl","AD");
    patientGraph = new CatBarGraph(patientData,"patient-chart-area","diagnosisColLabel","PTGENDER","Sex",fullWidth/2,fullWidth/3);

    histogram = new Histogram(patientData,"histogram-chart-area","histogramGeneralColLabel","AGE",20,fullWidth,fullWidth/3);
});

d3.csv("data/corr.csv", function(error,data) {
    if (!error) {
        corrData = data;
        wrangleCorrData();
    }
    else {
        console.log("Error importing CSV");
        console.log(error);
    }

    corrGraphWidth = $("#corr-chart-area").width();

    corrGraph = new CorrGraph(corrData, "corr-chart-area", corrGraphWidth / 1.2, corrGraphWidth / 1.2);
});

wrangleData = function() {
    allData.forEach(function(d){
        keys = d3.map(d, function(f){return f;}).keys();

        keys.forEach(function(key) {
            //d.key = ;
        });
    });
};

wrangleCorrData = function() {
    corrData.forEach(function(row){
        rowKeys = Object.keys(row);
        rowKeys.forEach(function(key){
            if (key !== "Label") {
                if (row[key] === "")
                    row[key] = 0;
                else
                    row[key] = +row[key];
            }
        });
    });
};

filterDataIncl = function(colLabel,value) {
    return allData.filter(function(d){ return d[colLabel] === value; });
};

filterDataExcl = function(colLabel,value) {
    return allData.filter(function(d){ return d[colLabel] !== value; });
};

updateGeneralCatGraph = function() {
    genderGraph.selectionChanged();
};

updateDiagnosisCatGraph = function() {
    controlGraph.selectionChanged();
    patientGraph.selectionChanged();
};