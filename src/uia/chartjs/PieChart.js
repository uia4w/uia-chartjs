sap.ui.define([
    "./BaseChart",
    "./library"
], function(
    BaseChart,
    library
) {
    "use strict";

    var ChartType = library.ChartType;

    /**
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given 
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * CartesianChart constructor
     * @extends uia.chartjs.CartesianChart
     * @alias uia.chartjs.BarChart
     * @version ${version}
     *
     * @constructor
     * @public
     * @since 1.40
     * @name uia.chartjs.BarChart
     */
    var PieChart = BaseChart.extend("uia.chartjs.PieChart", /** @lends uia.chartjs.PieChart.prototype */ {

        metadata: {

            library: 'uia.chartjs',

            properties: {

                cutoutPercentage: { type: "float", group: "Appearance", defaultValue: 0 },

                rotation: { type: "float", group: "Appearance", defaultValue: Math.PI },

                circumference: { type: "float", group: "Appearance", defaultValue: 2 * Math.PI },
            },

            events: {
            }
        },

        onBeforeRendering: function() {
            // BaseChart.prototype.setHoverMode.call(this, this.getHoverMode());
        },

        getChartType: function() {
            return ChartType.Pie;
        },

        applyOptionsEx: function(oOptions) {
            oOptions["cutoutPercentage"] = this.getCutoutPercentage();
            oOptions["rotation"] = this.getRotation();
            oOptions["circumference"] = this.getCircumference();
            return oOptions;
        }
    });

    return PieChart;

}, /* bExport= */ true);
