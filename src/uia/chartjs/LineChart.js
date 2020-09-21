sap.ui.define([
    "./CartesianChart",
    "./axes/CartesianAxis",
    "./library"
], function(
    CartesianChart,
    CartesianAxis,
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
     * @alias uia.chartjs.LineChart
     * @version ${version}
     *
     * @constructor
     * @public
     * @since 2.9.3.0
     * @name uia.chartjs.LineChartChart
     */
    var LineChart = CartesianChart.extend("uia.chartjs.LineChart", /** @lends uia.chartjs.LineChart.prototype */ {

        metadata: {

            library: 'uia.chartjs',

            properties: {

                hoverMode: { type: "string", group: "Appearance", defaultValue: "label" },
            }
        },

        onBeforeRendering: function() {
            // BaseChart.prototype.setHoverMode.call(this, this.getHoverMode());
        },

        getChartType: function() {
            return ChartType.Line;
        },


        applyOptionsEx: function(oOptions) {
            return oOptions;
        }
    });

    return LineChart;

}, /* bExport= */ true);
