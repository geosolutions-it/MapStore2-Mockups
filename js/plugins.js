/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    plugins: {
        FakeTOCPlugin: require('./plugins/FakeTOC'),
        FakeFooterPlugin: require('./plugins/FakeFooter'),
        FakeNavbarPlugin: require('./plugins/FakeNavbar'),
        FakeToolbarPlugin: require('./plugins/FakeToolbar'),

        BackgroundPlugin: require('./plugins/Background'),
        QueryBuilderPlugin: require('./plugins/QueryBuilder'),
        ArchivePlugin: require('./plugins/Archive'),

        HeaderPlugin: require('./plugins/Header'),
        FooterPlugin: require('./plugins/Footer'),
        MapArchivePlugin: require('./plugins/MapArchive'),

        HomePlugin: require('./plugins/Home'),

        ComponentsArchivePlugin: require('./plugins/ComponentsArchive'),
        DetailsDockPlugin: require('./plugins/DetailsDock'),
        // MapD3Plugin: require('./components/MapD3'),

        DashboardEditorPlugin: require('./plugins/DashboardEditor'),

        RulesManagerPlugin: require('./plugins/RulesManager'),

        DockGetfeatureInfoPlugin: require('./plugins/DockGetfeatureInfo'),

        TOCPlugin: require('./plugins/TOC'),

        AnnotationsPlugin: require('./plugins/Annotations')

    },
    requires: {}
};
