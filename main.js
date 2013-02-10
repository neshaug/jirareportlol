/*global console*/
(function () {
    "use strict";

    /**
     * @param done {Function} callback called when done loading
     */
    function load(done) {
        var scripts = [
            "//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.js",
            "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore.js"
            ],
            loadCount = 0;
        
        function loadScript(url, callback) {
            console.log("Loading: " + url);
            
            var script = document.createElement("script");
            script.src = url;
            script.onload = function () {
                callback(url);
            };
            
            document.body.appendChild(script);
        }
        
        function callback(url) {
            loadCount++;
            console.log("Done loading: " + url);
            if (loadCount === scripts.length) {
                console.log("Finished loading.");
                done();
            }
        }
        
        scripts.forEach(function (url) {
            loadScript(url, callback); 
        });
    }
    
    
    /*global $, _*/
    function main() {
        
        function hover(el) {
            var srcTr = $(el).parent("tr"),
                key = srcTr.parent().parent().attr("data-key"),
                targets = null;
                
            targets = _.chain($("table[data-key='" + key + "']").get()).map(function (table) {
               return _.map($(table).find("tr").get(), function(tr, key) {
                  if(_.isObject(tr) && key === srcTr.index()) {
                      return tr;
                  } 
               });
            }).flatten().value();
            
            function out() {
                _.each(targets, function (tr) {
                    $(tr).css("color", "black");
                });

                // clean up
                srcTr.off("click");
                srcTr.off("mouseout");
            }
            
            function click() {
                _.each(targets, function (tr) {
                    $(tr).remove();
                });
            }

            _.each(targets, function (tr) {
               $(tr).css("color", "red"); 
            });

            // attach
            srcTr.on("click", click);
            srcTr.on("mouseout", out);
        }
        
        // attach to body
        $("body").on("mouseover", function (e) {
            hover(e.target); 
        });
        
        // create a "key" for similar tables.. identical tables has the same 
        // number of parents and the same number of TR's
        _.each($("table").get(), function (table) {
            $(table).attr("data-key", $(table).parents().length + "" + 
               $(table).find("tr").length);
        });
    }
    
    // let's get started
    load(main);
}());
