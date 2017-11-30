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
const MapGrid = require('../components/maps-from-MapStore2/MapGrid');
const {Row, Col, Grid, Button, Panel, Glyphicon, Tooltip, OverlayTrigger} = require('react-bootstrap');
const Thumbnail = require('../../MapStore2/web/client/components/maps/forms/Thumbnail');
const Metadata = require('../../MapStore2/web/client/components/maps/forms/Metadata');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const Portal = require('../../MapStore2/web/client/components/misc/Portal');
// const PermissionEditor = require('../components/PermissionEditor');

const ReactQuill = require('react-quill');

const ResizableModal = require('../components/ResizableModal');
const PermissionGroup = require('../components/PermissionGroup');

require('react-quill/dist/quill.snow.css');


const mockupLink = () => {
    const a = document.createElement('a');
    a.setAttribute('href', '#/details-on-map');
    a.click();
};

class ThemeIcon extends React.Component {
    static propTypes = {
        background: PropTypes.string,
        color: PropTypes.string,
        backgroundPrimary: PropTypes.string,
        colorPrimary: PropTypes.string
    };

    static defaultProps = {
        background: '#ffffff',
        color: '#333333',
        backgroundPrimary: '#078aa3',
        colorPrimary: '#ffffff'
    };
    render() {
        return (
            <div className="ms-theme-icon">
                <div style={{backgroundColor: this.props.background}}>
                    <div style={{backgroundColor: this.props.color}}>
                        <div style={{backgroundColor: this.props.backgroundPrimary}}>
                            <div style={{backgroundColor: this.props.colorPrimary}}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class MapArchivePlugin extends React.Component {

    static propTypes = {
        maps: PropTypes.array
    };

    static defaultProps = {
        maps: [
            {id: 0, canEdit: true, title: 'Hello Map', description: 'My first map'},
            {id: 1, canEdit: true, title: 'A new Map', description: 'My second map'}
        ]
    };

    state = {
        openProperties: true,
        components: [],
        maps: [
            {id: 0, canEdit: true, title: 'Hello Map', description: 'My first map'},
            {id: 1, canEdit: true, title: 'A new Map', description: 'My second map'}
        ],
        mapId: 0,
        detalis: '',
        map: {}
    };

    renderLeftColumn() {
        const tooltipEngine = (
            <Tooltip id="tooltip-engine">Select map engine</Tooltip>
        );

        const tooltipTheme = (
            <Tooltip id="tooltip-theme">Select theme</Tooltip>
        );

        return (
            <div className="ms-vertical-toolbar" style={{order: -1}}>
                <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-add-map">Add new map</Tooltip>}>
                    <Button className="square-button no-border">
                        <Glyphicon glyph="plus"/>
                    </Button>
                </OverlayTrigger>
                <hr/>
                <div className="ms-v-selector">
                    <OverlayTrigger placement="right" overlay={tooltipEngine}>
                        <Button className="square-button no-border" onClick={() => this.setState({ openEngine: !this.state.openEngine, openThemes: false })}>
                            <Glyphicon glyph="cog"/>
                        </Button>
                    </OverlayTrigger>
                    <Panel collapsible expanded={this.state.openEngine}>
                        <Toolbar
                            btnDefaultProps={{ className: 'square-button no-border'}}
                            buttons={[{
                                text: <img src={require('../../assets/img/leaflet.png')} />,
                                tooltipPosition: 'right',
                                tooltip: 'Leaflet',
                                onClick: () => {

                                }
                            }, {
                                text: <img src={require('../../assets/img/openlayers.png')} />,
                                tooltipPosition: 'right',
                                tooltip: 'Openlayers',
                                onClick: () => {

                                }
                            }, {
                                text: <img src={require('../../assets/img/cesium.png')} />,
                                tooltipPosition: 'right',
                                tooltip: 'Cesium',
                                onClick: () => {

                                }
                            }]} />
                    </Panel>
                </div>
                <div className="ms-v-selector">
                    <OverlayTrigger placement="right" overlay={tooltipTheme}>
                        <Button className="square-button no-border" onClick={() => this.setState({ openThemes: !this.state.openThemes, openEngine: false })}>
                            <Glyphicon glyph="dropper"/>
                        </Button>
                    </OverlayTrigger>
                    <Panel collapsible expanded={this.state.openThemes}>
                        <Toolbar
                            btnDefaultProps={{ className: 'square-button no-border no-padding'}}
                            buttons={[{
                                text: <ThemeIcon
                                    background="#ffffff"
                                    color="#333333"
                                    backgroundPrimary="#078aa3"
                                    colorPrimary="#ffffff"/>,
                                tooltip: 'Default',
                                tooltipPosition: 'right',
                                onClick: () => {
                                    this.setState({
                                        text: this.state.removedText,
                                        removedText: ''
                                    });
                                }
                            }, {
                                text: <ThemeIcon
                                    background="#333333"
                                    color="#e99e9e"
                                    backgroundPrimary="#8ae234"
                                    colorPrimary="#333333"/>,
                                tooltip: 'Wasabi',
                                tooltipPosition: 'right',
                                onClick: () => {
                                    this.setState({
                                        text: this.state.removedText,
                                        removedText: ''
                                    });
                                }
                            }, {
                                text: <ThemeIcon
                                    background="#0a0b30"
                                    color="#f2f2f2"
                                    backgroundPrimary="#E95420"
                                    colorPrimary="#ffffff"/>,
                                tooltip: 'Console',
                                tooltipPosition: 'right',
                                onClick: () => {
                                    this.setState({
                                        text: this.state.removedText,
                                        removedText: ''
                                    });
                                }
                            }]} />
                    </Panel>
                </div>
            </div>
        );
    }

    render() {

        return (
            <div className="mapstore-body">
                <BorderLayout
                    columns={[this.renderLeftColumn()]}>
                    <MapGrid
                        viewerUrl={() => { mockupLink(); }}
                        editMap={(map) => {
                            this.setState({
                                openProperties: true,
                                mapId: map.id
                            });
                        }} maps={this.state.maps} colProps={{className: 'm-grid-cols', xs: 12, sm: 6, md: 3}}
                        deleteMap={() => {}}
                        openDetails={(map) => {
                            this.setState({
                                map
                            });
                        }}/>

                </BorderLayout>
                <Portal>
                <ResizableModal
                    show={!!this.state.showDetailEditor}
                    title="Details Sheet"
                    bodyClassName="modal-details-sheet-container"
                    size="lg"
                    fullscreen
                    fullscreenType="full"
                    onClose={() => {
                        this.setState({
                            showDetailEditor: false,
                            addNewDetail: false
                        });
                    }}
                    buttons={[{
                        text: 'Back',
                        onClick: () => {
                            this.setState({
                                showDetailEditor: false,
                                addNewDetail: false
                            });
                        }
                    }, {
                        text: 'Save',
                        onClick: () => {
                            this.setState({
                                showDetailEditor: false,
                                addNewDetail: this.state.text
                            });
                        }
                    }]}>
                    <div id="ms-details-editor">
                        <ReactQuill
                            bounds={"#ms-details-editor"}
                            value={this.state.text || ''}
                            onChange={(text) => {
                                if (text && text !== '<p><br></p>') {
                                    this.setState({
                                        text
                                    });
                                }

                            }}
                            modules={{

                                toolbar: [
                                [{ 'size': ['small', false, 'large', 'huge'] }, 'bold', 'italic', 'underline', 'blockquote'],
                                [{ 'list': 'bullet' }, { 'align': [] }],
                                [{ 'color': [] }, { 'background': [] }, 'clean'], ['image', 'video', 'link']
                            ]}}/>
                    </div>
                </ResizableModal>
                </Portal>
                <Portal>
                <ResizableModal
                    title="Are you sure to close without save your changes?"
                    bodyClassName="modal-details-sheet-confirm"
                    show={!!this.state.changesModal}
                    buttons={[{
                        text: 'No',
                        onClick: () => {
                            this.setState({
                                changesModal: false,
                                openProperties: true
                            });
                        }
                    }, {
                        text: 'Yes',
                        onClick: () => {
                            this.setState({
                                text: '',
                                changesModal: false,
                                openProperties: false
                            });
                        }
                    }]}>
                    <Grid fluid>
                        <Row>
                            <Col xs={12}>
                                Some fields has been changed.
                                <br/>
                                Are you sure to close without save your changes?
                            </Col>
                        </Row>
                    </Grid>
                </ResizableModal>
                </Portal>
                <Portal>
                <ResizableModal
                    title="Edit Map Properties"
                    show={this.state.openProperties && !this.state.showDetailEditor && !this.state.changesModal}
                    bodyClassName="ms-flex modal-properties-container"
                    buttons={[{
                        text: 'Close',
                        onClick: () => {
                            this.setState({
                                changesModal: !!this.state.text,
                                openProperties: false
                            });
                        }
                    }, {
                        text: 'Save',
                        onClick: () => {
                            this.setState({
                                openProperties: false,
                                text: '',
                                maps: this.props.maps.map((m) => { return m.id === this.state.mapId ? {...m, details: this.state.text} : {...m}; })
                            });
                        }
                    }]}
                    onClose={() => {
                        this.setState({
                            changesModal: !!this.state.text,
                            openProperties: false
                        });
                    }}>
                    <Grid fluid>
                        <div className="ms-map-properties">
                            <Row>
                                <Col xs={12}>
                                    <Thumbnail map={{id: 0}}/>
                                </Col>
                                <Col xs={12}>
                                    <Metadata />
                                </Col>
                            </Row>
                            <div
                                className={"ms-section" + (this.state.hideGroupProperties ? ' ms-transition' : '')}>
                                <div className="mapstore-block-width">
                                    <Row>
                                        <Col xs={6}>
                                            <div className="m-label">
                                                {!this.state.text ? 'Add New Deails Sheet' : 'Details Sheet'}
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                        <div className="ms-details-sheet">

                                                <div className="pull-right">
                                                    <Toolbar
                                                        btnDefaultProps={{ className: 'square-button-md no-border'}}
                                                        buttons={[{
                                                            glyph: !this.state.hideGroupProperties ? 'eye-close' : 'eye-open',
                                                            tooltip: !this.state.hideGroupProperties ? 'Show preview' : 'Hide preview',
                                                            visible: !!this.state.text,
                                                            onClick: () => {
                                                                if (this.state.text) {
                                                                    this.setState({
                                                                        hideGroupProperties: !this.state.hideGroupProperties
                                                                    });
                                                                }
                                                            }
                                                        }, {
                                                            glyph: 'undo',
                                                            tooltip: 'Undo remove',
                                                            visible: !!this.state.removedText,
                                                            onClick: () => {
                                                                this.setState({
                                                                    text: this.state.removedText,
                                                                    removedText: ''
                                                                });
                                                            }
                                                        }, {
                                                            glyph: 'pencil-add',
                                                            tooltip: 'Add details sheet',
                                                            visible: this.state.text ? false : true,
                                                            onClick: () => {
                                                                this.setState({
                                                                    showDetailEditor: true,
                                                                    removedText: ''
                                                                });
                                                            }
                                                        }, {
                                                            glyph: 'pencil',
                                                            tooltip: 'Edit details sheet',
                                                            visible: this.state.text ? true : false,
                                                            onClick: () => {
                                                                this.setState({
                                                                    showDetailEditor: true,
                                                                    removedText: ''
                                                                });
                                                            }
                                                        }, {
                                                            glyph: 'trash',
                                                            tooltip: 'Delete details sheet',
                                                            visible: !!this.state.text,
                                                            onClick: () => {
                                                                this.setState({
                                                                    text: '',
                                                                    removedText: this.state.text
                                                                });
                                                            }
                                                        }]}/>
                                                    </div>

                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                {this.state.text && <div className="ms-details-preview-container"><div className="ms-details-preview" dangerouslySetInnerHTML={{ __html: this.state.text }} /></div>}
                            </div>
                        </div>
                        {!this.state.hideGroupProperties &&
                        <div className="ms-permissions-container">

                            <PermissionGroup components={this.state.components} onChange={components => {
                                this.setState({ components });
                            }} />

                            {/*<Row>
                                <Col xs={12}>

                                    <PermissionEditor />
                                </Col>
                            </Row>*/}
                        </div>}
                    </Grid>
                </ResizableModal>

                </Portal>
                <Portal>
                <ResizableModal size="lg" fullscreen onClose={() => {
                    this.setState({
                        map: {}
                    });
                }} title={this.state.map.title + ' - Detail Sheet'} show={this.state.map && this.state.map.details}>
                    <div className="ms-detail-body">
                        <div dangerouslySetInnerHTML={{__html: this.state.map.details || ''}} />
                    </div>
                </ResizableModal>
                </Portal>
            </div>
        );
    }
}

module.exports = {
    MapArchivePlugin
};
