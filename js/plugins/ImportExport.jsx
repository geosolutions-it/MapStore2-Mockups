/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {Button, Glyphicon, DropdownButton, MenuItem, Grid, Col, Row, FormGroup, ControlLabel, Checkbox} = require('react-bootstrap');
const {BackgroundPlugin} = require('./Background');
const dragDropArea = require('../enhancers/dragDropArea');
const Background = dragDropArea(BackgroundPlugin);
const {FakeNavbarPlugin: FakeNavbar} = require('./FakeNavbar');
const Loader = require('../components/importexport/Loader');
const {head, join} = require('lodash');
const ResizableModal = require('../../MapStore2/web/client/components/misc/ResizableModal');
const Select = require('react-select');
const StyleCanvas = require('../../MapStore2/web/client/components/style/StyleCanvas');
const ColorSelector = require('../components/importexport/ColorSelector');
const bgImage = require('../../old_ms2_226bfec4/web/client/plugins/background/assets/img/mapnik.jpg');
const numberLocalizer = require('react-widgets/lib/localizers/simple-number');
numberLocalizer();
const {NumberPicker} = require('react-widgets');

const OverlayDropZone = ({onClose = () => {}, loading, error, type}) => <div
    style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        zIndex: 2000,
        display: 'flex',
        textAlign: 'center'
    }}
    onClick={() => onClose()}>

    {error && !loading &&
    <div style={{
        margin: 'auto',
        maxWidth: 550
    }}>
        <div>
            <Glyphicon
                glyph="exclamation-mark"
                style={{
                    fontSize: 80
                }}/>
        </div>
        <h5>
            {error} not valid
        </h5>
        <h4 className="text-danger" style={{backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: 12}}>
            !!Mockup Message -
            Here additional message eg. error on shapefile parsing
            - Mockup Message!!
        </h4>
        <h4>
            Drop a new configuration or vector files here.
        </h4>
        <small>
            Supported configuration files: MapStore2 legacy format or JSON OWS context format<br />
            Supported vector layer files: shapefiles must be contained in zip archives, KML/KMZ or GPX
        </small>
        <hr/>
        <small><i>
            current map will be overrided in case of configuration files
        </i></small>
    </div>}

    {loading &&
    <div style={{
        margin: 'auto',
        maxWidth: 550
    }}>
        <Loader
        size={80}
        color="#ffffff"
        style={{
            margin: 'auto'
        }}/>
        <h4>
            Loading {type}...
        </h4>
    </div>}

    {!loading && !error && <div style={{
        margin: 'auto',
        maxWidth: 550
    }}>
        <div>
            <Glyphicon
                glyph="upload"
                style={{
                    fontSize: 80
                }}/>
        </div>
        <h4>
            Drop your configuration or vector files here.
        </h4>
        <small>
            Supported configuration files: MapStore2 legacy format or JSON OWS context format<br />
            Supported vector layer files: shapefiles must be contained in zip archives, KML/KMZ or GPX
        </small>
        <hr/>
        <small><i>
            current map will be overrided in case of configuration files
        </i></small>
    </div>}
</div>;

const mimeTypes = [
    'application/json',
    'application/x-zip-compressed'
];

class ImportExport extends React.Component {

    static propTypes = {
        buttons: PropTypes.array
    };

    static defaultProps = {
        buttons: []
    };

    state = {
        displayDropZone: false,
        loading: false
    }

    render() {

        return (
            <div
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%'
                }}>
                <Background
                    dropArea
                    displayDropZone={this.state.displayDropZone}
                    controlled
                    onDrop={(files) => {
                        const validTypes = head(files.filter( file => head(mimeTypes.filter(type => type === file.type ))));
                        if (validTypes) {
                            const type = validTypes && validTypes.type;
                            this.setState({
                                loading: true,
                                type: type && (type === 'application/json' && 'configuration' || 'vector file')
                            });
                            setTimeout(() => {
                                this.setState({
                                    loading: false,
                                    displayDropZone: !validTypes,
                                    shapeModal: type !== 'application/json',
                                    error: null
                                });
                            }, 1000);
                        } else {
                            this.setState({
                                loading: false,
                                error: join(files.map(file => file.name), ','),
                                displayDropZone: !validTypes
                            });
                        }
                    }}
                    overlayDropZone={
                        <OverlayDropZone
                            type={this.state.type}
                            error={this.state.error}
                            loading={this.state.loading}
                            onClose={() => this.setState({ displayDropZone: false, error: null})}/>
                    }/>
                <Button
                    className="square-button shadow"
                    bsStyle="primary"
                    onClick={() => this.setState({ show: true })}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}>
                    <Glyphicon glyph="1-layer"/>
                </Button>
                <FakeNavbar
                    dropdown={
                        <DropdownButton bsStyle={'primary'} className="square-button" pullRight noCaret title={<Glyphicon glyph="menu-hamburger"/>} key={"burger"} >
                            <MenuItem header>Options</MenuItem>
                            <MenuItem>
                                <Glyphicon glyph="print"/> Print
                            </MenuItem>
                            <MenuItem
                                onClick={() => this.setState({ displayDropZone: true })}>
                                <Glyphicon glyph="upload"/> Import Data
                            </MenuItem>
                            <MenuItem
                                onClick={() => this.setState({ exportModal: true })}>
                                <Glyphicon glyph="download"/> Export Data
                            </MenuItem>
                            <MenuItem>
                                <Glyphicon glyph="folder-open"/> Catalog
                            </MenuItem>
                            <MenuItem>
                                <Glyphicon glyph="1-ruler"/> Measure
                            </MenuItem>
                            <MenuItem>
                                <Glyphicon glyph="cog"/> Settings
                            </MenuItem>
                            <MenuItem>
                                <Glyphicon glyph="question-sign"/> Help
                            </MenuItem>
                            <MenuItem>
                                <Glyphicon glyph="share-alt"/> Share
                            </MenuItem>
                            <MenuItem>
                                <Glyphicon glyph="comment"/> Annotation
                            </MenuItem>
                            <MenuItem>
                                <Glyphicon glyph="info-sign"/> About this app...
                            </MenuItem>
                        </DropdownButton>
                    }/>
                <ResizableModal
                    size="sm"
                    title={<span><Glyphicon glyph="download"/>&nbsp;Export map configuration</span>}
                    onClose={() => this.setState({
                        exportModal: false
                    })}
                    show={this.state.exportModal}
                    buttons={[
                        {
                            text: 'Export',
                            bsStyle: 'primary',
                            onClick: () => this.setState({
                                exportModal: false
                            })
                        }
                    ]}>
                    <div style={{
                            display: 'flex',
                            width: '100%',
                            height: '100%'
                        }}>
                        <div style={{
                            margin: 'auto',
                            width: 'calc(100% - 30px)'
                        }}>
                        <Grid fluid>
                            <Row>
                                <Col xs={12}>
                                    <FormGroup controlId="ms-export-format-select">
                                        <ControlLabel>Select format</ControlLabel>
                                        <Select
                                            options={[{
                                                label: 'Legacy MapStore2 format',
                                                value: 'MS2'
                                            }, {
                                                label: 'JSON OWS context format',
                                                value: 'OWS'
                                            }]}
                                            value="MS2"
                                            clearable={false}
                                            placeholder="Select format"
                                            simpleValue/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Grid>
                        </div>
                    </div>
                </ResizableModal>

                <ResizableModal
                    title={<span><Glyphicon glyph="upload"/>&nbsp;Add Local Vector Files</span>}
                    onClose={() => this.setState({
                        shapeModal: false
                    })}
                    show={this.state.shapeModal}
                    buttons={[
                        {
                            text: 'Cancel',
                            bsStyle: 'primary',
                            onClick: () => this.setState({
                                shapeModal: false
                            })
                        },
                        {
                            text: 'Add',
                            bsStyle: 'primary',
                            onClick: () => this.setState({
                                shapeModal: false
                            })
                        }
                    ]}>
                    <Grid
                        fluid
                        style={{
                            width: '100%',
                            padding: 15
                        }}>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <Select
                                        options={[{
                                            label: 'Vactor layer name',
                                            value: 'MS2'
                                        }]}
                                        value="MS2"
                                        clearable={false}
                                        placeholder="Select format"
                                        simpleValue/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <FormGroup>
                                    <Checkbox>Stile di default</Checkbox>
                                    <Checkbox>Zoom sui file</Checkbox>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <hr/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{display: 'flex'}}>
                                <StyleCanvas
                                    style={{ padding: 0, margin: "auto", display: "block"}}
                                    shapeStyle={
                                        {
                                            color: {
                                                r: 7,
                                                g: 138,
                                                b: 163,
                                                a: 1
                                            },
                                            fill: {
                                                r: 0,
                                                g: 0,
                                                b: 0,
                                                a: 0.1
                                            },
                                            width: 4
                                        }
                                    }
                                    geomType="Polygon"
                                />
                            </Col>
                        </Row>
                        <Row style={{marginTop: 30}}>
                            <Col xs={6}>
                                Stroke:
                            </Col>
                            <Col xs={6}>
                                <ColorSelector
                                    color={{
                                        r: 7,
                                        g: 138,
                                        b: 163,
                                        a: 1
                                    }}/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 12}}>
                            <Col xs={6}>
                                Fill:
                            </Col>
                            <Col xs={6}>
                                <ColorSelector
                                    color={{
                                        r: 0,
                                        g: 0,
                                        b: 0,
                                        a: 0.1
                                    }}/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 12}}>
                            <Col xs={6}>
                                Width:
                            </Col>
                            <Col xs={6}>
                                <NumberPicker min={1} max={15} step={1} value={4}/>
                            </Col>
                        </Row>
                    </Grid>
                </ResizableModal>
                <div className="background-plugin-position" style={{transition: '0.3s', left: 0, bottom: 30, pointerEvents: 'auto'}}>
                    <div className="background-preview-button" style={{margin: 5}}>
                    <div className="background-preview-button-container bg-body" style={{padding: 3, width: 78, height: 78}}>
                    <div className="background-preview-button-label" style={{width: 72, height: 0, marginTop: 0, padding: 0}}>
                    <div className="bg-body bg-text" style={{padding: 6}}>Open Street Map</div>
                    </div>
                    <div className="background-preview-button-frame" style={{width: 72, height: 72}}>
                    <img src={bgImage}/>
                    </div>
                    </div></div></div>
            </div>
        );
    }
}

module.exports = {
    ImportExportPlugin: ImportExport
};
