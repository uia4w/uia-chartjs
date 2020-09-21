/* global Chart:true */
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/Element"
], function(
    Control,
    Element,
    BaseOption
) {
    "use strict";

    /**
     * BaseChart class, it contains all the common properties, methods and events of a Chart
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given 
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * @extends sap.m.InputBase
     * @version ${version}
     *
     * @constructor
     * @public
     * @since 1.60
     * @name uia.chartjs.BaseChart
     */
    var BaseChart = Control.extend("uia.chartjs.BaseChart", /** @lends uia.chartjs.BaseChart.prototype */ {

        __ctx: undefined,

        __chart: undefined,

        __datasets: [],

        metadata: {

            "abstract": true,

            "library": 'uia.chartjs',

            "properties": {

                key: { type: "string", group: "common", defaultValue: undefined },

                height: { type: "int", group: "appearance", defaultValue: 400 },

                width: { type: "int", group: "appearance", defaultValue: 300 },

                labels: { type: "string[]", group: "appearance", defaultValue: [] },

                disableAnimation: { type: "boolean", group: "common", defaultValue: false }

            },

            "defaultAggregation": "datasets",

            "aggregations": {

                datasets: {
                    type: "uia.chartjs.data.Dataset",
                    multiple: true,
                    singularName: "datasets",
                    bindable: "bindable"
                },

                options: {
                    type: "uia.chartjs.options.BaseOption",
                    multiple: true,
                    singularName: "options",
                    bindable: "bindable"
                },

                plugins: {
                    type: "uia.chartjs.plugins.Plugin",
                    multiple: true,
                    singularName: "plugins",
                    bindable: "bindable"
                }
            },

            "events": {

                pointClick: {
                    parameters: {
                        points: { type: "array" },
                        info: { type: "object" }
                    }
                },

                keyChanged: {
                    parameters: {
                        value: { type: "object" }
                    }
                }
            }
        },

        constructor: function(sId, mSettings) {
            Element.apply(this, arguments);
        },

        getChartJS: function() {
            return this.__chart;
        },

        getOptions: function() {
            var result = {
                scales: this.getScalesOption(),
                plugins: {}
            };

            var options = this.getAggregation("options");
            if (options) {
                options.forEach(function(o) {
                    result[o.getName()] = o.toOption();
                });
            }

            var plugins = this.getAggregation("plugins");
            if (plugins) {
                plugins.forEach(function(p) {
                    result.plugins[p.getName()] = p.toOption();
                });
            }

            var optionsEx = this.applyOptionsEx(result);
            //            
            if (this.hasListeners("pointClick")) {
                var _fireF = this.firePointClick.bind(this);
                var _getPointsAtEvent = this.getPointsAtEvent.bind(this);
                optionsEx.onClick = function(mouseEvent) {
                    var points = _getPointsAtEvent(mouseEvent);
                    if (points.length == 0) {
                        return;
                    }

                    _fireF({
                        "points": points,
                        "info": {
                            "shiftKey": mouseEvent.shiftKey,
                            "altKey": mouseEvent.altKey,
                            "ctrlKey": mouseEvent.ctrlKey,
                            "x": mouseEvent.x,
                            "y": mouseEvent.y,
                            "screenX": mouseEvent.screenX,
                            "screenY": mouseEvent.screenY,
                            "type": mouseEvent.type
                        }
                    });
                }
            }
            //
            if (this.getDisableAnimation()) {
                if (!optionsEx.animation) {
                    optionsEx.animation = {};
                }
                optionsEx.animation["duration"] = 0;
                optionsEx["responsiveAnimationDuration"] = 0;
            }

            return optionsEx;
        },

        getChartType: function() {
            return "line";
        },

        getScalesOption: function() {
            return undefined;
        },

        applyOptionsEx: function(oOptions) {
            return oOptions;
        },

        /**
         * @override
         * 
         */
        setKey: function(oKey) {
            if (oKey) {
                this.setProperty("key", oKey, true);
                this.fireKeyChanged({ "value": oKey });
            } else {
                this.setProperty("key", null, true);
                this.fireKeyChanged({ "value": null });
            }
            return this;
        },

        /**
         * 
         * @param {uia.chartjs.data.Dataset} oDataset The dataset.
         */
        addDataset: function(oDataset) {
            this.addAggregation("datasets", oDataset);
            this.__datasets = this.__prepareDatasets();
            this.updateChart();
        },

        updateDatasets: function(sReason) {
            this.destroyDatasets();
            this.updateAggregation("datasets");
            this.__datasets = this.__prepareDatasets();
            this.updateChart();
        },

        updateChart: function(iDuration, bLazy, sEasing) {
            if (this.__chart) {
                this.__chart.data.datasets = this.__datasets;
                this.__chart.options = this.getOptions();
                this.__chart.update({
                    duration: iDuration,
                    lazy: bLazy,
                    easing: sEasing
                });
            }
        },

        onAfterRendering: function() {
            //
            this.__datasets = this.__prepareDatasets();
            //
            var plugins = [];
            (this.getAggregation("plugins") || []).forEach(function(p) {
                var chartjsImpl = p.implement();
                if (chartjsImpl) {
                    plugins.push(chartjsImpl);
                }
            });
            //
            var options = this.getOptions();
            //
            this.__ctx = document.getElementById(this.getId()).getContext("2d");
            this.__chart = new Chart(this.__ctx, {
                type: this.getChartType(),
                data: {
                    labels: this.getLabels(),
                    datasets: this.__datasets
                },
                plugins: plugins,
                options: options
            });
        },

        /**
         * The wrap method.
         */
        destroyChart: function() {
            if (this.__chart) {
                this.__chart.clear();
                this.__chart.destroy();
            }
        },

        /**
         * The wrap method.
         */
        reset: function() {
            if (this.__chart) {
                this.__chart.reset();
            }
        },

        /**
         * The wrap method.
         * 
         * @param {int} iDuration  Time for the animation of the redraw in milliseconds.
         * @param {boolean} bLazy  If true, the animation can be interrupted by other animations.
         * @param {string} sEasing The animation easing function.
         */
        render: function(iDuration, bLazy, sEasing) {
            if (this.__chart) {
                this.__chart.render({
                    duration: iDuration,
                    lazy: bLazy,
                    easing: sEasing
                });
            }
        },

        /**
         * The wrap method.
         * 
         * @returns {uia.chartjs.BaseChart} This.
         */
        stop: function() {
            if (this.__chart) {
                this.__chart.stop();
            }
            return this;
        },

        /**
         * The wrap method.
         * 
         * @returns {uia.chartjs.BaseChart} This.
         */
        resize: function() {
            if (this.__chart) {
                this.__chart.resize();
            }
            return this;
        },

        /**
         * The wrap method.
         * 
         * @returns {uia.chartjs.BaseChart} This.
         */
        clear: function() {
            if (this.__chart) {
                this.__chart.clear();
            }
            return this;
        },

        /**
         * The wrap method.
         * 
         * @returns {any} This.
         */
        toBase64Image: function() {
            if (this.__chart) {
                return this.__chart.toBase64Image();
            }
            return null;
        },

        /**
         * The wrap method.
         * 
         * @param {any} oEvent The mouse event object.
         * @returns {any} This.
         */
        getElementsAtEvent: function(oEvent) {
            if (this.__chart) {
                return this.__chart.getElementsAtEvent(oEvent);
            }
            return [];
        },

        /**
         * The wrap method.
         * 
         * @param {any} oEvent The mouse event object.
         * @returns {any} This.
         */
        getDatasetAtEvent: function(oEvent) {
            if (this.__chart) {
                return this.__chart.getDatasetAtEvent(oEvent);
            }
            return null;
        },

        /**
         * The wrap method.
         * 
         * @param {int} iIndex The index.
         * @returns {any} This.
         */
        getDatasetMeta: function(iIndex) {
            if (this.__chart) {
                return this.__chart.getDatasetMeta(iIndex);
            }
            return null;
        },

        /**
         * The wrap method.
         * 
         * @param {any} oEvent The mouse event object.
         * @returns {any} This.
         */
        getPointsAtEvent: function(oEvent) {
            var points = [];
            if (this.__chart) {
                var elements = this.__chart.getElementsAtEvent(oEvent) || [];
                for (var i = 0; i < elements.length; i++) {
                    var e = elements[i];
                    var point = {
                        datasetIndex: e._datasetIndex,
                        datasetLabel: this.__chart.data.datasets[e._datasetIndex].label,
                        index: e._index,
                        value: this.__chart.data.datasets[e._datasetIndex].data[e._index]
                    };
                    points.push(point);
                }
            }
            return points;
        },

        __prepareDatasets: function() {
            var result = [];
            var datasets = this.getAggregation("datasets");
            for (var i = 0; i < datasets.length; i++) {
                result.push(datasets[i].toDataset(this));
            }
            return result;
        }
    });

    return BaseChart;

}, /* bExport= */ true);
