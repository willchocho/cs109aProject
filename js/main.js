var allData, controlData, patientData;
var generalGraph, controlGraph, patientGraph;
var histogram, controlHistogram, patientHistogram;

d3.csv("data/ADNIMERGE.csv", function(error,data) {
    if (!error) {
        allData = data;
        controlData = filterDataExcl("DX_BL","AD");
        patientData = filterDataIncl("DX_BL","AD");
        wrangleData();
    }
    else {
        console.log("Error importing CSV");
        console.log(error);
    }

    fullWidth = $("#general-chart-area").width();

    generalGraph = new CatBarGraph(allData,"general-chart-area","generalColLabel","PTGENDER","Sex",fullWidth,fullWidth/3);
    controlGraph = new CatBarGraph(controlData,"control-chart-area","diagnosisColLabel","PTGENDER","Sex",fullWidth/2,fullWidth/3);
    patientGraph = new CatBarGraph(patientData,"patient-chart-area","diagnosisColLabel","PTGENDER","Sex",fullWidth/2,fullWidth/3);

    histogram = new Histogram(allData,"histogram-chart-area","histogramGeneralColLabel","AGE",20,fullWidth,fullWidth/3);
    controlHistogram = new Histogram(controlData,"control-histogram-area","histogramDiagnosisColLabel","AGE",20,fullWidth/2,fullWidth/3);
    patientHistogram = new Histogram(patientData,"patient-histogram-area","histogramDiagnosisColLabel","AGE",20,fullWidth/2,fullWidth/3);
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
    generalGraph.selectionChanged();
};

updateDiagnosisCatGraph = function() {
    controlGraph.selectionChanged();
    patientGraph.selectionChanged();
};

updateGeneralHistogram = function() {
    histogram.selectionChanged();
};

updateDiagnosisHistogram = function() {
    controlHistogram.selectionChanged();
    patientHistogram.selectionChanged();
};
