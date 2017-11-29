/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const {head} = require('lodash');
const MapGrid = require('../../MapStore2/web/client/components/maps/MapGrid');
const {Row, Col, Grid, Button, Panel, Glyphicon, Tooltip, OverlayTrigger} = require('react-bootstrap');
const Thumbnail = require('../../MapStore2/web/client/components/maps/forms/Thumbnail');
const Metadata = require('../../MapStore2/web/client/components/maps/forms/Metadata');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const Portal = require('../../MapStore2/web/client/components/misc/Portal');
// const PermissionEditor = require('../components/PermissionEditor');
const ReactQuill = require('react-quill');
const ResizableModal = require('../components/ResizableModal');
const PermissionGroup = require('../components/PermissionGroup');

import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

require('react-quill/dist/quill.snow.css');
let count = 0;
class DashboardEditorPlugin extends React.Component {

    static propTypes = {
        buttons: PropTypes.array
    };

    static defaultProps = {
        buttons: []
    };

    state = {
        cards: [],
        selectedCards: []
    };

    renderLeftColumn() {

        const buttons = [{
            glyph: 'plus',
            tooltip: 'Add a dashboard card',
            bsStyle: !this.state.closeSideLeft ? 'primary' : 'success',
            tooltipPosition: 'right',
            visible: this.state.selectedCards.length === 0,
            onClick: () => {
                this.setState({
                    closeSideLeft: !this.state.closeSideLeft
                });
                /*this.setState({
                    cards: [...this.state.cards, {id: 'db' + count, type: 'none' }]
                });
                count++;*/
            }
        }, {
            glyph: 'pencil',
            tooltip: 'Add a dashboard card',
            tooltipPosition: 'right',
            visible: this.state.selectedCards.length === 1 && this.state.selectedCards[0].type !== 'none',
            onClick: () => {
                this.setState({
                    cards: [],
                    selectedCards: []
                });
            }
        }, {
            glyph: 'trash',
            tooltip: 'Add a dashboard card',
            tooltipPosition: 'right',
            visible: this.state.selectedCards.length > 0,
            onClick: () => {
                this.setState({
                    cards: this.state.cards.filter(c => !head(this.state.selectedCards.filter(s => s.id === c.id))),
                    selectedCards: []
                });
            }
        }];
        return (
            <div key="ms-v-bar" className="ms-vertical-toolbar" style={{order: -1}}>
                <Toolbar btnDefaultProps={{ className: 'square-button', bsStyle: 'primary'}} buttons={buttons}/>
            </div>
        );
    }

    renderLeftPanel() {
        const close = !this.state.closeSideLeft ? ' ms-close' : '';
        return (
            <div key="ms-v-left" className={"ms-vertical-side" + close} style={{order: -1}}>
                Hello
            </div>

        );
    }

    render() {
        // const layout = this.state.widgetList.map((wL, i) => {return {sm: {i: 'wg' + i, x: i, y: 0, w: 2, h: 1}}; }); layout={layout} breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        // {lg: 7, md: 6, sm: 5, xs: 4, xxs: 4}}
        return (
            <div className="mapstore-body">
                <BorderLayout columns={[this.renderLeftColumn(), this.renderLeftPanel()]}>
                    <ResponsiveReactGridLayout
                        className="ms-dashboard-layout"
                        rowHeight={208}
                        compactType={'horizontal'}
                        cols={{lg: 7}}>
                        {this.state.cards.map(c => {
                            const selected = head(this.state.selectedCards.filter(s => s.id === c.id)) && ' ms-selected' || '';
                            return (
                                <div
                                    key={c.id}
                                    className={'ms-dashboard-card' + selected}
                                    onClick={e => {
                                        if (e.ctrlKey) {
                                            this.setState({ selectedCards: [...this.state.selectedCards, c] });
                                        } else {
                                            if (selected) {
                                                this.setState({ selectedCards: [] });
                                            } else {
                                                this.setState({ selectedCards: [c] });
                                            }
                                        }
                                    }}>

                                </div>);
                        })}
                    </ResponsiveReactGridLayout>
                </BorderLayout>
            </div>
        );
    }
}

module.exports = {
    DashboardEditorPlugin
};
