/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {Panel} = require('react-bootstrap');
const SwitchButton = require('./SwitchButton');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class SwitchPanel extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        expanded: PropTypes.bool,
        onSwitch: PropTypes.func,
        locked: PropTypes.bool,
        buttons: PropTypes.array,
        transitionProps: PropTypes.object
    };

    static defaultProps = {
        title: '',
        expanded: false,
        onSwitch: () => {},
        locked: false,
        buttons: [],
        transitionProps: {
            transitionName: "switch-panel-transition",
            transitionEnterTimeout: 300,
            transitionLeaveTimeout: 300
        }
    };

    componentWillMount() {
        this.setState({
            expanded: this.props.expanded
        });
    }

    renderHeader() {
        return (<div>
            <div className="pull-left">{this.props.title}</div>
            <div className="pull-right">
                {!this.props.locked ? <SwitchButton
                    checked={this.props.expanded}
                    onSwitch={(checked) => {
                        this.props.onSwitch(checked);
                        this.setState({
                            expanded: checked
                        });
                    }}/> : null}
                {this.props.buttons.length > 0 && this.state.expanded && <Toolbar btnDefaultProps={{ className: 'square-button-sm no-border'}} buttons={this.props.buttons}/>}
            </div>
        </div>);
    }

    renderBody() {
        return (<div>
            <ReactCSSTransitionGroup {...this.props.transitionProps}>
                {this.props.children}
            </ReactCSSTransitionGroup>
        </div>);
    }

    render() {
        return (<div className="mapstore-switch-panel">
            <Panel header={this.renderHeader()}>
                {this.state.expanded ? this.renderBody() : null}
            </Panel>
        </div>);
    }
}

module.exports = SwitchPanel;
