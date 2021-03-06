sap.ui.define([
    "sap/ui/core/Element",
    "./Plugin",
    "../3rdparty/chartjs-plugin-crosshair/chartjs-plugin-crosshair"
], function(
    Element,
    Plugin
) {
    "use strict";

    /**
     * Crosshair plugin OpenUI5 wrapper
     */
    var Crosshair = Plugin.extend("ui5.chartjs.plugins.Crosshair", {

        metadata: {

            library: "ui5.chartjs.plugins",
        },

        constructor: function(sId, mSettings) {
            Element.apply(this, arguments);
        },

        getName: function() {
            return "crosshair";
        }
    });

    return Crosshair;

}, /* bExport= */ true);
