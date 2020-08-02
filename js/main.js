// set up the containers in treeLib config
treeLib.buildConfig(['g1', 'g2']);

// global variable for dataset, passed to all d3 generators
var FileData;

$(document).ready(function(){
    menu.setupCheckBoxes();

    // initial acc is leaves, see menu.config.accumulated
    $("#checkBoxAccumulated").prop("checked", true);
    $(".data-info-types-span.leaves").css('opacity', 1);
    $(".data-info-types-span.size").css('opacity', .25);

    $("#checkBoxAccumulated").on("click", function() {     
        var isChecked = $(this).prop("checked");
        
        if (isChecked){
            menu.updateAccumulated('leaves');
            $(".data-info-types-span.leaves").css('opacity', 1);
            $(".data-info-types-span.size").css('opacity', .25);
        } else { 
            menu.updateAccumulated('size');
            $(".data-info-types-span.leaves").css('opacity', .25);
            $(".data-info-types-span.size").css('opacity', 1);
        }

        var locked1 = menu.isLocked('1');
        var locked2 = menu.isLocked('2');

        loadVisualization('1', locked1);

        loadVisualization('2', locked2);
    });

    $("#checkBoxRememberLayout1").on("click", function() {
        menu.changeLockPosition('1');
    });

    $("#checkBoxRememberLayout2").on("click", function() {
        menu.changeLockPosition('2');
    });    
});

function Remove_nodechildren(id){
    var parent = document.getElementById(id)
    var childrens = parent.childNodes;
    if(childrens != ''){
        for(var i = childrens.length-1; i >=0; i--)
        {
        parent.removeChild(childrens[i]);
        }
    }
}

function change_tiling(type, position){
    change_map(position)
}       

function clearVisualization(position){
    d3.select("#g" + position+ "-div")
        .html("")
        .append("svg")
        .attr("id", "g" + position)
        .attr("viewBox", "0 0 500 500");

    d3.select("svg#g"+position).on('doneDrawing', function(){
        var objS = document.getElementById("dropdown" + position);
        
        // var grade = objS.options[objS.selectedIndex].text;
        var grade = objS.value;
        treeLib.updateConfig(grade,'g'+position);
    });
}

// update both maps if one is changed
function change_map(position){
    // unlock the changed map
    menu.unlockPosition(position);

    // which map was changed?
    var position2 = position == '1' ? '2' : '1';
    var position1 = position == '1' ? '1' : '2';
    
    // resetCfg();
    // reset both maps when one layout is changed 
    // remember to lock the choices???
    var locked1 = menu.isLocked(position1);
    var locked2 = menu.isLocked(position2)

    loadVisualization(position1, locked1);

    loadVisualization(position2, locked2);
}

function loadVisualization(position, locked){

    clearVisualization(position);

    // hide specific tags for treemap and radial trees
    $("#layout" + position + "_treemap").addClass("hide-tag");
    $("#nodeSizeDiv" + position + "_radialtree").addClass("hide-tag");

    // various resets on changing a layout unless locked
    if (!locked) {
        menu.resetProportionalSize(position);
    }

    var objS = document.getElementById("dropdown" + position);
    
    var grade = objS.value;

    if(grade == "Pack"){
        this.draw_pack("#g" + position);
    }
    else if(grade == "Sunburst"){
        this.draw_sunburst("#g" + position);
    }
    else if(grade == "Treemap"){
        $("#layout" + position + "_treemap").removeClass("hide-tag");

        this.draw_treemap("#g" + position, document.getElementById("dropdown" + position + "_treemap").selectedIndex);
    }
    else if(grade == "Zoomable_Treemap"){
        this.draw_zoomable_treemap("#g" + position);
        
    }
    else if(grade == "Collapsible_Tree"){
        $("#nodeSizeDiv" + position + "_radialtree").removeClass("hide-tag");
        this.draw_collapsible_tree("#g" + position);
    }
    else if(grade == "Radial_Tree"){
        $("#nodeSizeDiv" + position + "_radialtree").removeClass("hide-tag");
        this.draw_radial_tree("#g" + position);
    }

    

    d3.select("#g"+position).attr("viewBox", function(){
        return "0 0 500 500";
    })
}

var FileName;
var dataSourcePapers, dataSourceCitations;

window.onload = function(){
    var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); };
    var colors = d3.schemeCategory20.map(fader);
    
    treeLib.shuffleArray(colors);
    
    color = d3.scaleOrdinal(colors);

    FileName = menu.changeDataset(FileName, 1);

    menu.dataTypeSpanText();
    
    loadVisualization("1");
    loadVisualization("2");
        
}

function updateDataset() {
    FileName = menu.changeDataset(FileName);
    
    menu.dataTypeSpanText();
    // allow user to select from intermediate levels of nodes
    // and only display them in the graph
    // 1. iterate through data
    // 2. make a collection of of distinct nodes from each level
    // 3. build a multiselect for each level from the nodes
    // 4. filter dataset on load of json
    dataFilterSubset()

    var locked1 = menu.isLocked('1');
    var locked2 = menu.isLocked('2');

    loadVisualization('1', locked1);

    loadVisualization('2', locked2);
}

function dataFilterSubset() {
    d3.json(FileName, function(error, data) {
        debugger;
    });
}

