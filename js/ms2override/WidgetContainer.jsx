/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const Message = require('../../old_ms2_226bfec4/web/client/components/I18N/Message');
const BorderLayout = require('../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
const ConfirmModal = require('../../old_ms2_226bfec4/web/client/components/maps/modals/ConfirmModal');

module.exports = ({
    id,
    title,
    confirmDelete= false,
    toggleDeleteConfirm = () => {},
    onDelete=() => {},
    topLeftItems,
    topRightItems,
    children
    }) =>
    (<div className="mapstore-widget-card" id={id}>
        <BorderLayout header={(<div className="mapstore-widget-info">
                    <div className="mapstore-widget-header">
                        <div className="mapstore-widget-options">
                            {topLeftItems}
                        </div>
                        <div className="widget-title">{title}</div>
                        <div className="mapstore-widget-options">
                            {topRightItems}
                        </div>
                    </div>
                </div>)}>
                {children}
        </BorderLayout>
        {confirmDelete ? <ConfirmModal
            confirmText={<Message msgId="widgets.widget.menu.delete" />}
            titleText={<Message msgId="widgets.widget.menu.delete" />}
            body={<Message msgId="widgets.widget.menu.confirmDelete" />}
            show={confirmDelete}
            onClose={() => toggleDeleteConfirm(false)}
            onConfirm={() => onDelete(id) }/> : null}
    </div>
);
