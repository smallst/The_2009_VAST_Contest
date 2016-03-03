var connectfilteru = {
    "employee":41,
    "handler": 40,
    "middle":  5,
    "leader":  500
}, connectfilterd = {
    "employee":39,
    "handler": 30,
    "middle" : 1,
    "leader" : 100
};

var identi = ["employee","handler","middle", "leader"];
function infilter (d) {
    for(i = 0;i<4;i++)
    {
        if(d <= connectfilteru[identi[i]] && d >= connectfilterd[identi[i]])
            return i+1;
    }
    return 0;
}
var tip = d3.tip()
        .attr("class","d3-tip")
        .html(function (d) {
            return "name: " + d.name + "<br>"+"id: "+ (d.index+1) +"<br>"+"country: "+d.countryname+"<br>";
        });
var shiftKey,width,height,svg,force,color;
width = $(window).width() *0.75;
height = $(window).height() - 20;
var foci=[{x:~~(width* 0.1),y:~~(height/2)},
          {x:~~(width* 0.3),y:~~(height/2)},
          {x:~~(width*0.55),y:~~(height/2)},
          {x:~~(width*0.85),y:~~(height/2)}];
function init(){
    
    svg = d3.select("body")
        .attr("tabindex",1)
        .each(function  () {
            this.focus();
        })
        .append("svg")
        .attr("id","main")
        .attr("width",width)
        .attr("height",height)
        .call(tip);
    svg.append("line")
        .attr("x1",width*0.2)
        .attr("x2",width*0.2)
        .attr("y1",0)
        .attr("y2",height)
        .attr("stroke","blue");
    svg.append("line")
        .attr("x1",width*0.4)
        .attr("x2",width*0.4)
        .attr("y1",0)
        .attr("y2",height)
        .attr("stroke","blue");
    svg.append("line")
        .attr("x1",width*0.7)
        .attr("x2",width*0.7)
        .attr("y1",0)
        .attr("y2",height)
        .attr("stroke","blue");
    
    force = d3.layout
        .force()
        .linkDistance(50)
        .linkStrength(0)
        .charge(function   (d) {
            return -20* Math.sqrt(d.weight);
        })
        .chargeDistance(width* 0.2)
        .gravity(0)
        .size([width,height]);

    color = ["#ff0000",
            "#fbff00",
            "#00aef2",
            "#22ee3c",
            "#aaaaaa"];
    nodedata.forEach(function  (d) {
        d.x = ~~(Math.random()*width);
        d.y = ~~(Math.random()*height);
    });
    force.nodes(nodedata)
        .links(linkdata)
        .start();
    draw("employee"); 
}
function draw (filter) {
    console.log('draw called');
    nodedata.forEach(function  (d) {
        d.ffilter = [-1,false,false,false,false,false];
    });
    linkdata.forEach(function  (d) {
        var sourceinde = d.source.ffilter[0]= infilter(d.source.weight);
        var targetinde = d.target.ffilter[0]= infilter(d.target.weight);
        if(sourceinde && targetinde && Math.abs(sourceinde - targetinde) == 1)
        {
            d.source.ffilter[targetinde] = true;
            d.target.ffilter[sourceinde] = true;;
        }
    });
    nodedata.forEach(function  (d) {
        var inf = infilter(d.weight);
        if(inf && d.ffilter!== [-1,false,false,false,false,false])
        {
            switch(inf)
            {
            case 1:
                d.sele = d.ffilter[2];
                break;
            case 2:
                d.sele = (d.ffilter[1] && d.ffilter[3]);
                break;
            case 3:
                d.sele = (d.ffilter[2] && d.ffilter[4]);
                break;
            case 4:
                d.sele = (d.ffilter[3]);
                break;
            default:
                d.sele = false;
            }
        }
        else d.sele = false;
    });
    var link = svg.append("g").attr("class","link")
            .selectAll(".link")
            .data(linkdata)
            .enter().append("line")
            .filter(function  (d) {
                return d.source.sele && d.target.sele;
            })
            .attr("class","link")
            .classed(filter,true)
            .style("fill","#bbb")
            .style("stroke-width",function (d) {
                return d.value;
            });
    var node = svg.append("g").attr("class","node")
            .selectAll(".node")
            .data(nodedata)
            .enter().append("circle")
            .filter(function  (d) {
                return d.sele;
            })
            .attr("class","node")
            .classed(filter,true)
            .classed("selected",true)
            .attr("r",function  (d) {
                return 2+Math.sqrt(d.weight);
            })
            .style("fill",function(d){
                return color[+d.group];})
            .on("mouseover",function  (d) {
                tip.show(d);
            })
            .on("mouseout",function  () {
                tip.hide();
            })
            .on("mousedown",function  (d) {
                    node.classed("selected",function  (p) {
                        return p.selected = false;
                    });
                    for(var ii = 0;ii<3;ii++)
                    {
                        link.classed("selected",function  (p) {
                            if(p.source.selected &&
                               
                               (p.source.ffilter[0]-d.ffilter[0])*
                               (p.target.ffilter[0] - p.source.ffilter[0]) >=0 &&
                               
                               Math.abs(p.source.ffilter[0] - p.target.ffilter[0]) ==1 )
                            {
                                p.source.selected = p.target.selected = true;
                                return true;
                            } else if(p.target.selected &&

                                      (p.target.ffilter[0]-d.ffilter[0])*
                                      (p.source.ffilter[0] - p.target.ffilter[0]) >=0 &&
                                      
                                      Math.abs(p.source.ffilter[0] - p.target.ffilter[0] ) ==1)
                            {
                                p.source.selected = p.target.selected = true;
                                return true;
                            }
                            else
                                return false;
                        });
                        node.classed("selected",function  (p) {
                            p.fixed = (( p === d)|| p.fixed) ;
                            return p.selected || (p.selected=p === d);
                        });
                    }
            })
            .call(force.drag);
    force.resume(); 
    var fourwidth=[0,0.2,0.4,0.7,1];
    force.on("tick",function  () {
        var k = 0.1* force.alpha();
        node.attr("cx",function  (d) {
            if(d.fixed) return d.x;
            var radius = Math.sqrt(d.weight);
            d.x +=((foci[d.ffilter[0]-1]).x-d.x)*k;
            return d.x = Math.max(width*fourwidth[d.ffilter[0]-1]+radius,
                                  Math.min(width*(fourwidth[d.ffilter[0]])-radius,d.x));
        })
            .attr("cy",function(d){
                if(d.fixed ) return d.y;
                var radius = Math.sqrt(d.weight);
                d.y += (foci[d.ffilter[0]-1].y-d.y)*k;
                return d.y = Math.max(20+radius,Math.min(height-radius,d.y));
            });
        link.attr("x1",function (d) { return d.source.x; })
            .attr("y1",function (d) { return d.source.y; })
            .attr("x2",function (d) { return d.target.x; })
            .attr("y2",function (d) { return d.target.y; });
    });
    
}
function updatefilter(filter){
    console.log("update called");
    svg.selectAll(".node").remove();
    svg.selectAll(".link").remove();
    draw(filter);
}