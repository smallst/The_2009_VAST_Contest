function drawslider (datab,datae,name) {
    
    console.log('drawslider called');
    d3.select("#"+name).selectAll("*").remove();
    var dataForSlider = [];
    for (i = 0; i < 5; i++){
        dataForSlider[i] = datab + i*(datae-datab)/4;
    }
    var marginForSlider = {top: 20, right: 12, bottom: 20, left: 12},
        widthForSlider = 220 - marginForSlider.left - marginForSlider.right,
        heightForSlider = 60 - marginForSlider.top - marginForSlider.bottom;

    var sliderScale = d3.scale.linear()
            .range([0, widthForSlider])
            .domain([dataForSlider[0],dataForSlider[4]]);

    var y = heightForSlider / 2;

    var brushForSlider = d3.svg.brush()
            .x(sliderScale)
            .extent([connectfilterd[name], connectfilteru[name]])
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

    var arc = d3.svg.arc()
            .outerRadius(heightForSlider / 2)
            .startAngle(0)
            .endAngle(2*Math.PI);

    var svgForSlider = d3.select("#"+name).attr("width", widthForSlider + marginForSlider.left + marginForSlider.right)
            .attr("height", heightForSlider + marginForSlider.top + marginForSlider.bottom)
            .append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + marginForSlider.left + "," + marginForSlider.top + ")");

    svgForSlider.append("g")
        .attr("class", "sliderAxis")
        .attr("transform", "translate(0," + heightForSlider + ")")
        .call(d3.svg.axis().scale(sliderScale).orient("bottom").tickValues(dataForSlider));

    var circle = svgForSlider.append("g").selectAll("circle")
            .data(dataForSlider)
            .enter().append("circle")
            .attr("transform", function(d) { return "translate(" + sliderScale(d) + "," + y + ")"; })
            .attr("r", 6);

    var brushg = svgForSlider.append("g")
            .attr("class", "brushForSlider")
            .call(brushForSlider);

    brushg.selectAll(".resize").append("path")
        .attr("transform", "translate(0," +  heightForSlider / 2 + ")")
        .attr("d", arc);

    brushg.selectAll("rect")
        .attr("height", heightForSlider);

    brushstart();
    brushmove();

    function brushstart() {
        svgForSlider.classed("selecting", true);
        document.getElementsByClassName(name)[0].getElementsByTagName("input")[0].value="";
        document.getElementsByClassName(name)[0].getElementsByTagName("input")[1].value="";
    }

    function brushmove() {
        var s = brushForSlider.extent();
        circle.classed("selected", function(d) { return s[0] <= d && d <= s[1]; });
        d3.select("."+name).select("input[name='down']").attr("placeholder",Math.ceil(s[0]));
        d3.select("."+name).select("input[name='up']").attr("placeholder",~~s[1]);
        connectfilterd[name]=Math.ceil(s[0]);
        connectfilteru[name] = ~~s[1];
    }

    function brushend() {
        var s = brushForSlider.extent();
        console.log(s[0]);
        svgForSlider.classed("selecting", !d3.event.target.empty());
        updatefilter(name);
    }
}