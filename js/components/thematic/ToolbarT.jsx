/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
const React = require('react');
const { ButtonGroup} = require('react-bootstrap');
const ToolbarButton = require('../../../MapStore2/web/client/components/misc/toolbar/ToolbarButton');

const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
/**
 CHANGES FOR ADD CUSTOM COMPONENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
module.exports = ({
    buttons = [],
    btnGroupProps={},
    btnDefaultProps = {},
    transitionProps = {
        transitionName: "toolbar-btn-transition",
        transitionEnterTimeout: 300,
        transitionLeaveTimeout: 300
    }} = {}) => {
        const renderButtons = () => buttons.map(
            ({ visible = true, ...props }, index) => visible
                ? (props.component || <ToolbarButton key={props.key || index} {...btnDefaultProps} {...props} />)
                : null
        );
        return (<ButtonGroup {...btnGroupProps}>
            {transitionProps
                ? <ReactCSSTransitionGroup {...transitionProps}>{renderButtons()}</ReactCSSTransitionGroup>
                : renderButtons()}
            </ButtonGroup>);
    };
