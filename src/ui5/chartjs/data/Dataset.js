sap.ui.define([
    "sap/ui/core/Element"
], function(
    Element
) {
    "use strict";

    var Dataset = Element.extend("ui5.chartjs.data.Dataset", {

        metadata: {

            "abstract": true,
            
            "library": "ui5.chartjs.data",

            "properties": {

                data: { type: "any", group: "data" },

                label: { type: "string", group: "data", defaultValue: "top" },

                order: { type: "int", group: "data", defaultValue: 0 },

                xAxisID: { type: "string", group: "data", defaultValue: undefined },

                yAxisID: { type: "string", group: "data", defaultValue: undefined },
            },

            "aggregations": {

                plugins: {
                    type: "ui5.chartjs.plugins.Plugin",
                    multiple: true,
                    singularName: "plugin"
                }
            }
        },

        getName: function() {
            return undefined;
        },

        toOption: function() {
            return {};
        },

        toDataset: function(oChart) {
            var oDataset = {
                "data": this.getData(),
                "label": this.getLabel(),
                "order": this.getOrder(),
                "xAxisID": this.getXAxisID(),
                "yAxisID": this.getYAxisID()
            };

            //  plugin options only for this dataset
            var plugins = this.getAggregation("plugins") || [];
            plugins.forEach(function(p) {
                oDataset[p.getName()] = p.toOption();
            });

            return this.applyDatasetEx(oChart, oDataset);
        },

        applyDatasetEx: function(oChart, oDataset) {
            return oDataset;
        }
    });


    return Dataset;

}, /* bExport= */ true);
