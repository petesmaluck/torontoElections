    $(function () {

      //SETUP GOOGLE LAYER
      var $map=$("#map");
      var map = new google.maps.Map($map[0], {
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: new google.maps.LatLng(43.6825, -79.2667), // Toronto
          styles: [{featureType:"landscape",stylers:[{saturation:-100},{lightness:65},{visibility:"on"}]},{featureType:"poi",stylers:[{saturation:-100},{lightness:51},{visibility:"simplified"}]},{featureType:"road.highway",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"road.arterial",stylers:[{saturation:-100},{lightness:30},{visibility:"on"}]},{featureType:"road.local",stylers:[{saturation:-100},{lightness:40},{visibility:"on"}]},{featureType:"transit",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"administrative.province",stylers:[{visibility:"off"}]/**/},{featureType:"administrative.locality",stylers:[{visibility:"off"}]},{featureType:"administrative.neighborhood",stylers:[{visibility:"on"}]/**/},{featureType:"water",elementType:"labels",stylers:[{visibility:"on"},{lightness:-25},{saturation:-100}]},{featureType:"water",elementType:"geometry",stylers:[{hue:"#ffff00"},{lightness:-25},{saturation:-97}]}]        
        });
        
      //LOAD DATA
      var geoJson = subdivisions();
      var geoJsonWards = wards();

      
      //CALCULATE WARD VOTES
      var wardVotes = d3.nest()
      .key(function(d) { return d.properties.WARD;})
      .rollup(function(d) { return {
        "toryVotes": d3.sum(d, function(g) {return g.properties.TORYJOHN;}),
        "chowVotes": d3.sum(d, function(g) {return g.properties.CHOWOLIVIA;}), 
        "fordVotes": d3.sum(d, function(g) {return g.properties.FORDDOUG;}),
        "totalVotes": d3.sum(d, function(g) {return g.properties.TotalVotes;}),
        "zero": 0
      }})
      .entries(geoJson.features);

      //CALCULATE CITY WIDE VOTES
      var cityVotes = d3.nest()
      .rollup(function(d) { return {
        "toryVotes": d3.sum(d, function(g) {return g.properties.TORYJOHN;}),
        "chowVotes": d3.sum(d, function(g) {return g.properties.CHOWOLIVIA;}), 
        "fordVotes": d3.sum(d, function(g) {return g.properties.FORDDOUG;}),
        "totalVotes": d3.sum(d, function(g) {return g.properties.TotalVotes;}),
        "zero": 0
      }})
      .entries(geoJson.features);

      //REORGANIZE DATA FOR IMMIGRATION PIE CHARTS
      var immigration = [];
      for(var i = 0; i < geoJson.features.length; i++) {
              immigration.push({
              "subdivision": geoJson.features[i].properties.AREA_NAME,
              "imm": geoJson.features[i].properties.Imm_Perc,
              "nonImm": geoJson.features[i].properties.NonImm_Per,
            });
      };
                 
      //OVERLAY SVG LAYER
      var overlay = new google.maps.OverlayView();

      overlay.onAdd = function () {

        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "SvgOverlay");
        var svg = layer.append("svg")
          .attr("width", $map.width())
          .attr("height", $map.height())
        var adminDivisions = svg.append("g").attr("class", "divisions");
        var wardDivisions = svg.append("g").attr("class", "wards");

     //VOTING RESULTS LEGEND
      var data = ['',40,50,60,70,80];

      var legendRow = function(color,top,candidate,dat){
      var legend = d3.select("#legendColors").append("svg")
        .attr("class", "legend")
        .attr("width", 240)
        .attr("height",100);
      
      var legendGroup = legend.attr("height", 25)
        .attr('x',0)
        .attr('y',top)
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate("+ i * 34 + ",0)"; });

      legendGroup.append("rect")
        .attr('x',8)
        .attr("width", 33)
        .attr("height", 15)
        .style("fill", color)
        .style('opacity', function(d, i) { return i * 0.2 ; });

      legendGroup.append("text")
        .attr('class', function(d,i) {
          return "mayor_" + candidate
        })
        .attr("x", 8)
        .attr("y", 20)
        .attr("dy", ".35em")
        .style('font-size',10)
        .text(function(d,i) { return d; });

      legend.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("dy", ".35em")
        .style('font-size',12)
        .text(candidate);
      }

       legendRow('#003399',0,'Tory');
       legendRow('#990000',16,'Ford');
       legendRow('#6600FF',32,'Chow');


       var bar = d3.select(".subdivisionChart");
       var bar2 = d3.select(".voteChart");
       var bar3 = d3.select(".cityChart");

       var education = d3.select("#education");
       var religion = d3.select("#religion");
       var income = d3.select("#income");
       var occupation = d3.select("#occupation");
       var transportation = d3.select("#transportation");

        
        //CHART WIDTH DOMAIN AND RANGE
        var x = d3.scale.linear()
            .domain([0, 100])
            .range([0, 222]);

          var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5);

            bar.append('g')
            .attr("class", "axis")
            .attr('transform', 'translate(0,25)')
            .call(xAxis);

            d3.selectAll('.axis text')
              .attr('transform','translate(5,0)');


        var xEducation = d3.scale.linear()
            .domain([0, 80])
            .range([0, 200]);

            var xAxisEducation = d3.svg.axis().scale(xEducation).orient('bottom').ticks(5);

            education.append('g')
            .attr("class", "axis")
            .attr('transform', 'translate(75,112)')
            .call(xAxisEducation);

            d3.selectAll('.axis text')
              .attr('transform','translate(5,0)');

        var xReligion = d3.scale.linear()
            .domain([0, 100])
            .range([0, 200]);

            var xAxisReligion = d3.svg.axis().scale(xReligion).orient('bottom').ticks(5);

            religion.append('g')
            .attr("class", "axis")
            .attr('transform', 'translate(75,112)')
            .call(xAxisReligion);

            d3.selectAll('.axis text')
              .attr('transform','translate(5,0)');

        var xIncome = d3.scale.linear()
            .domain([0, 100])
            .range([0, 200]);

            var xAxisIncome = d3.svg.axis().scale(xIncome).orient('bottom').ticks(5);

            income.append('g')
            .attr("class", "axis")
            .attr('transform', 'translate(75,112)')
            .call(xAxisIncome);

            d3.selectAll('.axis text')
              .attr('transform','translate(5,0)');

        var xOccupation = d3.scale.linear()
            .domain([0, 60])
            .range([0, 200]);

            var xAxisOccupation = d3.svg.axis().scale(xOccupation).orient('bottom').ticks(5);

            occupation.append('g')
            .attr("class", "axis")
            .attr('transform', 'translate(75,112)')
            .call(xAxisOccupation);

            d3.selectAll('.axis text')
              .attr('transform','translate(5,0)');

        var xTransportation = d3.scale.linear()
            .domain([0, 100])
            .range([0, 200]);

            var xAxisTransportation = d3.svg.axis().scale(xTransportation).orient('bottom').ticks(5);

            transportation.append('g')
            .attr("class", "axis")
            .attr('transform', 'translate(75,112)')
            .call(xAxisTransportation);

            d3.selectAll('.axis text')
              .attr('transform','translate(5,0)');


        overlay.draw = function () {
          var markerOverlay = this;
          var overlayProjection = markerOverlay.getProjection();

          // Turn the overlay projection into a d3 projection
          var googleMapProjection = function (coordinates) {
            var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
            var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
            return [pixelCoordinates.x + 4000, pixelCoordinates.y + 4000];
          }
            
          //SIDEBAR
            var sideBar = function(d){
              
              var title = d3.select('div.title').append('text')
              .attr('class','title')
              .text(function() {return d.properties.WARD});

              var ward = d3.select('div.ward').append('text')
              .attr('class','ward')
              .text(function() {return d.properties.SUBDIVISIO});

              //DECIMAL FORMATTING
              var decimal = d3.format(".3n");
              var percent = d3.format(",%");
              var percent1 = d3.format(",.1%"); 
                  
                  var bars = function(data,name,color,width1,width2) {
                    bar.append("rect")
                    .attr('class','bar')
                        .attr("width", function() { return x(data * 100) ; })
                        .attr("height", 20)
                        .attr("x", function() { return  x((width1 + width2) * 100); })
                        .attr("y", 5)
                        .attr("dy", ".35em")
                        .style('fill', color);

                    bar.append("text")
                    .attr('class','bar')
                        .attr("x", function() { return x((width1 + width2) * 100) + 25; })
                        .attr("y", 13)
                        .attr("dy", ".35em")
                        .style('fill','#fff')
                        .text(function() { 
                          if ((data * 100) >= 12)
                            { return decimal(data * 100) }
                              else 
                                { return ''}
                        }); 
                      }
                      
                      bars(d.properties.TORY_Perc,'Tory','#003399',0,0);
                      bars(d.properties.FORD_Perc,'Ford','#990000',d.properties.TORY_Perc,0);
                      bars(d.properties.CHOW_Perc,'Chow','#6600FF',d.properties.TORY_Perc,d.properties.FORD_Perc);


                     //WARD RESULTS
                     var wardBars = function(data,color,width1,width2) {
                      bar2.append("rect")
                        .attr('class','bar')
                        .attr("width", function() {
                          for (var i = 0; i < wardVotes.length; i++) { 
                            if (d.properties.WARD == wardVotes[i].key) {
                              var total = wardVotes[i].values["totalVotes"];
                          return x((wardVotes[i].values[data] / total)* 100)
                        }}})
                        .attr("height", 20)
                        .attr("x", function() { 
                          for (var i = 0; i < wardVotes.length; i++) { 
                            if (d.properties.WARD == wardVotes[i].key) {
                              var total = wardVotes[i].values["totalVotes"];
                              return  x((wardVotes[i].values[width1]/total)*100 + (wardVotes[i].values[width2]/total)*100); }}})
                        .attr("y", 5)
                        .style('fill', color);

                      bar2.append("text")
                      .attr('class','bar')
                        .attr("x", function() { 
                          for (var i = 0; i < wardVotes.length; i++) { 
                            if (d.properties.WARD == wardVotes[i].key) {
                              var total = wardVotes[i].values["totalVotes"];
                              return  x((wardVotes[i].values[width1]/total)*100 + (wardVotes[i].values[width2]/total)*100) + 25; }}})
                          .attr("y", 13)
                          .attr("dy", ".35em")
                          .style('fill','#fff')
                          .text(function() { 
                            for (var i = 0; i < wardVotes.length; i++) { 
                            if (d.properties.WARD == wardVotes[i].key) {
                              var total = wardVotes[i].values["totalVotes"];
                              if (wardVotes[i].values[data] / total * 100 > 12){return decimal(wardVotes[i].values[data] / total * 100) }
                                else {return ''}
                            }}}

                         ); 

                      }

                      wardBars("toryVotes",'#003399',"zero","zero");
                      wardBars("fordVotes",'#990000',"toryVotes","zero");
                      wardBars("chowVotes",'#6600FF',"toryVotes","fordVotes");

                     //WARD RESULTS
                     var cityBars = function(data,color,width1,width2) {
                      bar3.append('rect')
                        .attr('class','bar')
                        .attr("width", function() {
                          return x((cityVotes[data] / cityVotes["totalVotes"]) * 100)
                        })
                        .attr("height", 20)
                        .attr("x", function() { 
                              return  x(((cityVotes[width1]/cityVotes["totalVotes"]) * 100) + ((cityVotes[width2]/cityVotes["totalVotes"]) * 100)); 
                            })
                        .attr("y", 5)
                        .style('fill', color);

                      bar3.append("text")
                      .attr('class','bar')
                        .attr("x", function() { 
                              return  x(((cityVotes[width1]/cityVotes["totalVotes"]) * 100) + ((cityVotes[width2]/cityVotes["totalVotes"]) * 100)) + 25; 
                            })
                          .attr("y", 13)
                          .attr("dy", ".35em")
                          .style('fill','#fff')
                          .text(function() { return decimal((cityVotes[data] / cityVotes["totalVotes"]) * 100); }); 

                      }

                      cityBars("toryVotes",'#003399',"zero","zero");
                      cityBars("fordVotes",'#990000',"toryVotes","zero");
                      cityBars("chowVotes",'#6600FF',"toryVotes","fordVotes");

                     //SOCIOECONOMIC CHARTS ON THE FOOTER
                     var socioStats = function(data,top,title,type,scale) {
                      
                      type.append('rect')
                        .attr('class','bar')
                        .attr("width", function() {
                          return scale(d.properties[data] * 100)
                        })
                        .attr("height", 15)
                        .attr("x", 75)
                        .attr("y", top)
                        .style('fill', "steelblue");

                      type.append("text")
                      .attr('class','bar')
                        .attr("x", function() {
                          return 78 + scale(d.properties[data] * 100)
                          })
                        .attr("y", top + 8)
                        .attr("dy", ".35em")
                        .style('fill','#fff')
                        .style('text-anchor','start')
                        .text(function() { return percent1(d.properties[data]) ; }); 

                      type.append("text")
                      .attr('class','bar')
                        .attr("x", 70)
                        .attr("y", top + 8)
                        .attr("dy", ".35em")
                        .style('fill','#fff')
                        .style('font-size', 10)
                        .style('text-anchor','end')
                        .text(function() { return title; }); 
                     

                      }

                      //PLACING THE BAR GRAPHS IN THE DOM
                      var barSpacing = 16;
                      socioStats("EDU_nonHS_",barSpacing*1,"No High School",education,xEducation);
                      socioStats("EDU_HS_Per",barSpacing*2,"High School",education,xEducation);
                      socioStats("EDU_Trades",barSpacing*3,"Trades",education,xEducation);
                      socioStats("EDU_Colleg",barSpacing*4,"College",education,xEducation);
                      socioStats("EDU_UniBac",barSpacing*5,"Bachelors",education,xEducation);
                      socioStats("EDU_UniMst",barSpacing*6,"Masters/PhD",education,xEducation);

                      socioStats("RelBUD_Per",barSpacing*0,"Buddhist",religion,xReligion);
                      socioStats("RelCRS_Per",barSpacing*1,"Christian",religion,xReligion);
                      socioStats("RelHDU_Per",barSpacing*2,"Hindu",religion,xReligion);
                      socioStats("RelJEW_Per",barSpacing*3,"Jewish",religion,xReligion);
                      socioStats("RelMUM_Per",barSpacing*4,"Muslim",religion,xReligion);
                      socioStats("NonRel_Per",barSpacing*5,"Non-Religious",religion,xReligion);
                      socioStats("RelOtr_Per",barSpacing*6,"Other",religion,xReligion);

                      socioStats("HHinc_less",barSpacing*1,"Less 30k",income,xIncome);
                      socioStats("HHinc_30k_",barSpacing*2,"$30k - $50k",income,xIncome);
                      socioStats("HHinc_50k_",barSpacing*3,"$50k - $80K",income,xIncome);
                      socioStats("HHinc_80K_",barSpacing*4,"$80k - $100k",income,xIncome);
                      socioStats("HHinc_100K",barSpacing*5,"$100k - $125k",income,xIncome);
                      socioStats("HHinc_125k",barSpacing*6,"$125k+",income,xIncome);

                      socioStats("OCC_Trades",barSpacing*0,"Trades",occupation,xOccupation);
                      socioStats("OCC_Mgmt_P",barSpacing*1,"Mgmt",occupation,xOccupation);
                      socioStats("OCC_Busine",barSpacing*2,"Business",occupation,xOccupation);
                      socioStats("OCC_Sci_Pe",barSpacing*3,"Science",occupation,xOccupation);
                      socioStats("OCC_Health",barSpacing*4,"Health",occupation,xOccupation);
                      socioStats("OCC_EduLaw",barSpacing*5,"Edu/Law/Gov",occupation,xOccupation);
                      socioStats("OCC_ArtsCu",barSpacing*6,"Arts/Culture",occupation,xOccupation);

                      socioStats("Mode_Car_P",barSpacing*2,"Car",transportation,xTransportation);
                      socioStats("Mode_PubTr",barSpacing*3,"Public Transit",transportation,xTransportation);
                      socioStats("Mode_Walk_",barSpacing*4,"Walk",transportation,xTransportation);
                      socioStats("Mode_Bike_",barSpacing*5,"Bike",transportation,xTransportation);
                      socioStats("Mode_Other",barSpacing*6,"Other",transportation,xTransportation);

                      
                    var socioStatsPie = function(el,a,b){

                      var div = d3.select(el)
                          .html(function(){
                            return '<span class="pie bar">' + decimal(d.properties[a]) + ',' + decimal(d.properties[b]) + '</span><p>' 
                                      + percent(d.properties[a]) + '</p>'
                          });


                                          }

                      socioStatsPie("#immigration","Imm_Perc","NonImm_Per");
                      socioStatsPie("#visMinorities","VisMin_Per","NonVisMin_");
                      $(".pie").peity("pie",{
                        fill: ["steelblue", "rgba(220,220,220,0.1)"]
                      });



                      } 
          
          //SUB-DIVISION BOUNDARIES
          path = d3.geo.path().projection(googleMapProjection);
          var polygons = adminDivisions.selectAll("path")
            .data(geoJson.features)
            .attr("d", path) // update existing paths
          .enter().append("svg:path")
            .attr("d", path)
            .attr('id', function(d) {return d.properties.AREA_LONG} );


          //WHITE WARD BOUNDARIES
          pathWards = d3.geo.path().projection(googleMapProjection);
          
          var polygonsWards = wardDivisions.selectAll("path")
            .data(geoJsonWards.features)
            .attr("d", pathWards)
            .enter();

          var polygonsWardNumbers = wardDivisions.selectAll("text")
                    .data(geoJsonWards.features)
                    .attr("x",function(d){
                        return path.centroid(d)[0];                         
                    })
                    .attr("y", function(d){
                        return path.centroid(d)[1];                         
                    }) 
                    .enter()                        
                    .append("text")
                    .text(function(d){
                        return d.properties.SCODE_NAME;
                    })
                    .attr("x",function(d){
                        return path.centroid(d)[0];                         
                    })
                    .attr("y", function(d){
                        return path.centroid(d)[1];

                    })
                    .attr("text-anchor","middle")
                    .attr('font-size','12pt')
                    .attr('class','wardNumber')
                    .style('fill','#fff');; 

          polygonsWards.append("svg:path")
            .attr('class','wardBoundaries')
            .attr("d", pathWards)
            .attr('id', function(d) {return d.properties.AREA_LONG} )
            .style('stroke','white')
            .style('stroke-width',2)
            .style('fill','none');

                    

            //RULES FOR MAP COLOUR SCHEME
            polygons.style('fill', function(d){
              if (d.properties.CHOW_Perc > d.properties.FORD_Perc && d.properties.CHOW_Perc > d.properties.TORY_Perc){
                return '#6600FF'
              }
              if (d.properties.FORD_Perc > d.properties.TORY_Perc && d.properties.FORD_Perc > d.properties.CHOW_Perc){
                return '#990000'
              }
              if (d.properties.TORY_Perc > d.properties.FORD_Perc && d.properties.TORY_Perc > d.properties.CHOW_Perc){
                return '#003399'
              }

            })
            .style('opacity', function(d) {
              if (d.properties.CHOW_Perc > 0.8 || d.properties.FORD_Perc > 0.8 || d.properties.TORY_Perc > 0.8 ){
                return 1
              }
              if (d.properties.CHOW_Perc > 0.7 || d.properties.FORD_Perc > 0.7 || d.properties.TORY_Perc > 0.7 ){
                return 0.8
              }
              if (d.properties.CHOW_Perc > 0.6 || d.properties.FORD_Perc > 0.6 || d.properties.TORY_Perc > 0.6 ){
                return 0.6
              }
              if (d.properties.CHOW_Perc > 0.5 || d.properties.FORD_Perc > 0.5 || d.properties.TORY_Perc > 0.5 ){
                return 0.4
              }
              if (d.properties.CHOW_Perc > 0.4 || d.properties.FORD_Perc > 0.4 || d.properties.TORY_Perc > 0.4 ){
                return 0.3
              }
              else {return 0.2}
            })
            ;


            //EVENTS - MOUSEOVER; adjust graphs - MOUSEOUT; remove elements
            polygons.on('mouseover', sideBar)
            .on('mouseout', function() {
              var removeTitle = d3.select('.title text').remove();
              var removeWard = d3.select('.ward text').remove();
              var removeDivision = d3.select('.division text').remove();
              var removeBars = d3.selectAll('.bar').remove();
              var removeText = d3.selectAll('.barText').remove();
              var removeLegend = d3.selectAll('.legend rect text').remove();
              return [removeTitle,removeWard, removeDivision,removeBars,removeText,removeLegend];
            });
            //TOUCH EVENTS FOR MOBILE - SPECIFICALLY TABLETS
            polygons.on('touchstart', sideBar)
            .on('touchend', function() {
              var removeTitle = d3.select('.title text').remove();
              var removeWard = d3.select('.ward text').remove();
              var removeDivision = d3.select('.division text').remove();
              var removeBars = d3.selectAll('.bar').remove();
              var removeText = d3.selectAll('.barText').remove();
              var removeLegend = d3.selectAll('.legend rect text').remove();
              return [removeTitle,removeWard, removeDivision, removeBars,removeText,removeLegend];
            });

        };

      };

      overlay.setMap(map);
      
      
    });
