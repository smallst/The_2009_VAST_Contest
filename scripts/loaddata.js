var linkdata= [];

linkdata[0] = {};
linkdata[0]["source"] = 1;
linkdata[0]["target"] = 2;
linkdata[0]["value"]= 1;
var nodedata = [];
var countrycode = {Ryzkland:3,
                   Kouvnic:2,
                   Solvenz:2,
                   Kannvic:2,
                   Prounov:1,
                   Koul:0,
                   Solank:3,
                   Pasko:3,
                   Sresk:3,
                   Otello:4,
                   Transpasko:4,
                   Tulamuk:4};

function peocity () {
    console.log('peocity called');
    d3.text("M2/People-Cities.txt","text/plain",function  (data) {
        data = data.split(/\s+/);
        for (i = 4; i < data.length; i+=2) {
            nodedata[i/2-2]["group"]= countrycode[data[i+1]];
            nodedata[i/2-2]["countryname"] = data[i+1];
        }   
    });
}

d3.text("M2/Flitter_Names.txt","text/plain",function   (data) {
    data = data.split(/\s+/);
    for( i = 0;i<data.length;i+=2 )
    {
        nodedata[i/2] = {};
        nodedata[i/2]["name"] = data[i+1];
    }
    peocity();
    getlink();
});
function getlink () {
    console.log('getlink called');
    d3.text("M2/Links_Table.txt","text/plain",function  (data) {
        data = data.split(/\s+/);
        var length = data.length;
        console.log(length);
        for (i = 6; i < 59745; i+=2) {
            linkdata[i/2-2] = {};
            linkdata[i/2-2]["source"] = +data[i+1]-1;
            linkdata[i/2-2]["target"] = +data[i]-1;
            linkdata[i/2-2]["value"] = 1;
        }
        init();
    });
}