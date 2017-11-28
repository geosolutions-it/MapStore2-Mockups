/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    pages: [{
        name: "index",
        path: "/",
        component: require('./pages/Index')
    }, {
        name: "home",
        path: "/home",
        component: require('./pages/Home')
    }, {
        name: "components",
        path: "/components",
        component: require('./pages/Components')
    }, {
        name: "style-editor",
        path: "/style-editor",
        component: require('./pages/StyleEditor')
    }, {
        name: "dashboard",
        path: "/dashboard",
        component: require('./pages/Dashboard')
    }, {
        name: "maps-properties",
        path: "/maps-properties",
        component: require('./pages/MapsList')
    }, {
        name: "query-builder",
        path: "/query-builder",
        component: require('./pages/QueryBuilder')
    }, {
        name: "statistical",
        path: "/statistical",
        component: require('./old/pages/Statistical')
    }, {
        name: "styleeditor",
        path: "/styleeditor",
        component: require('./old/components/styleeditor')
    }, {
        name: "styleeditorline",
        path: "/styleeditorline",
        component: require('./old/components/styleeditorline')
    }, {
        name: "styleeditorpolygon",
        path: "/styleeditorpolygon",
        component: require('./old/components/styleeditorpolygon')
    }, {
        name: "styleeditorraster",
        path: "/styleeditorraster",
        component: require('./old/components/styleeditorraster')
    }, {
        name: "toc",
        path: "/toc",
        component: require('./old/components/FakeTOC')
    }, {
        name: "widget",
        path: "/widget",
        component: require('./old/pages/WidgetPage')
    }],
    pluginsDef: require('./plugins.js'),
    initialState: {
        defaultState: {},
        mobile: {}
    }
};
