/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {connect} = require('react-redux');
const Dock = require('react-dock').default;
const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const {Grid, Row, Col, Glyphicon, Button, FormGroup, FormControl, Nav, NavItem, DropdownButton, MenuItem} = require('react-bootstrap');
const tooltip = require('../../MapStore2/web/client/components/misc/enhancers/tooltip');
const NavItemT = tooltip(NavItem);
const Filter = require('../../MapStore2/web/client/components/misc/Filter');
const SideGrid = require('../../MapStore2/web/client/components/misc/cardgrids/SideGrid');
const Portal = require('../../MapStore2/web/client/components/misc/Portal');
const ReactQuill = require('react-quill');
// const ResizableModal = require('../../MapStore2/web/client/components/misc/ResizableModal');
const ResizableModal = require('../components/ResizableModal');
const ColorSelector = require('../components/ColorSelector');
const {head} = require('lodash');
const MarkerUtils = require('../../MapStore2/web/client/utils/MarkerUtils');
const Select = require('react-select');

const glyphs = MarkerUtils.getGlyphs('fontawesome');
const colors = MarkerUtils.extraMarkers.colors;
const shapes = MarkerUtils.extraMarkers.shapes;
const markers = MarkerUtils.extraMarkers.getGrid();
const bIndexMarker = markers[0].markers.reduce((a, b, i) => b.name === 'black' ? i : a, 0);
const Slider = require('react-nouislider');

const translateColor = {
    'red': 'red',
    'orange-dark': 'darkorange',
    'orange': 'orange',
    'yellow': 'yellow',
    'blue-dark': 'darkblue',
    'blue': 'blue',
    'cyan': 'cyan',
    'purple': 'purple',
    'violet': 'violet',
    'pink': 'pink',
    'green-dark': 'darkgreen',
    'green': 'green',
    'green-light': 'lightgreen',
    'black': 'black'
};
require('font-awesome/css/font-awesome.css');

const DropdownButtonT = tooltip(DropdownButton);
const DropdownGeometry = ({onClick, ...props}) => (
    <DropdownButtonT tooltip={props.tooltip} className="square-button-md" bsStyle="primary" title={<Glyphicon glyph="pencil-add"/>} noCaret>
        <MenuItem onClick={() => { onClick(); }} eventKey="1"><Glyphicon glyph="point"/>&nbsp; Marker</MenuItem>
        <MenuItem onClick={() => { onClick(); }} eventKey="2"><Glyphicon glyph="line"/>&nbsp; Line</MenuItem>
        <MenuItem onClick={() => { onClick(); }} eventKey="3"><Glyphicon glyph="polygon"/>&nbsp; Polygon</MenuItem>
    </DropdownButtonT>
);


let count = 1;
class Annotations extends React.Component {
    static propTypes = {
        annotations: PropTypes.array,
        open: PropTypes.bool
    };

    static defaultProps = {
        annotations: [
            {
                title: 'My annotation',
                preview: <Glyphicon glyph="comment"/>
            }
        ],
        open: true
    };

    state = {
        annotations: [
            {
                title: 'My first annotation',
                description: '<p>This is an annotation</p>',
                preview: 'comment',
                id: 'annotation:0',
                marker: {
                    color: 'blue',
                    shape: 'circle',
                    icon: 'comment'
                }
            }
        ],
        action: 'view',
        currentAnnotation: {
            marker: {
                color: 'blue',
                shape: 'circle',
                icon: 'comment'
            }
        },
        styleType: 'marker'
    };

    renderHeader() {
        return (
            <Grid fluid className="ms-header" style={this.state.action === 'style' ? { width: '100%', boxShadow: 'none'} : { width: '100%' }}>
                <Row>
                    <Col xs={2}>
                        <Button bsStyle="primary-inverse" className="square-button no-events">
                            <Glyphicon glyph="comment"/>
                        </Button>
                    </Col>
                    <Col xs={8}>
                        <h4>Annotations</h4>
                    </Col>
                    <Col xs={2}>
                        <Button bsStyle="primary-inverse" className="square-button">
                            <Glyphicon glyph="1-close"/>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className="text-center">
                        <Toolbar
                            btnDefaultProps={{ className: 'square-button-md', bsStyle: 'primary'}}
                            buttons={[
                                {
                                    glyph: 'plus',
                                    tooltip: 'Create new annotation',
                                    visible: this.state.action === 'view',
                                    onClick: () => {
                                        this.setState({
                                            action: 'new',
                                            warnTitle: false,
                                            currentAnnotation: {
                                                title: '',
                                                description: '',
                                                marker: {
                                                    color: 'blue',
                                                    shape: 'circle',
                                                    icon: 'comment'
                                                }
                                            }
                                        });
                                    }
                                },
                                {
                                    glyph: 'arrow-left',
                                    tooltip: 'Cancel create new annotation',
                                    visible: this.state.action === 'new' || this.state.action === 'preview' || this.state.action === 'edit' || this.state.action === 'style',
                                    onClick: () => {
                                        if (this.state.action === 'preview') {
                                            this.setState({
                                                action: 'view'
                                            });
                                        } else if (this.state.action === 'style') {
                                            this.setState({
                                                action: this.state.lastAction
                                            });
                                        } else {
                                            this.setState({
                                                showBackModal: true
                                            });
                                        }

                                    }
                                },
                                {
                                    el: DropdownGeometry,
                                    visible: this.state.action === 'new' || this.state.action === 'edit',
                                    tooltip: 'Add new geometry to annotation',
                                    onClick: () => {
                                        this.setState({
                                            showMockAdd: true
                                        });
                                    }
                                },
                                {
                                    glyph: 'polygon-trash',
                                    tooltip: 'Remove geometry',
                                    visible: this.state.action === 'new' || this.state.action === 'edit',
                                    onClick: () => {
                                        this.setState({
                                            showMockDelete: true
                                        });
                                    }
                                },
                                {
                                    glyph: 'dropper',
                                    tooltip: 'Choose a different style',
                                    visible: this.state.action === 'new' || this.state.action === 'edit',
                                    onClick: () => {
                                        this.setState({
                                            action: 'style',
                                            lastAction: this.state.action,
                                            showMockTab: true
                                        });
                                    }
                                },
                                {
                                    glyph: 'floppy-disk',
                                    tooltip: 'Save annotation',
                                    visible: this.state.action === 'new' || this.state.action === 'edit',
                                    onClick: () => {
                                        if (this.state.currentAnnotation.title) {
                                            if (this.state.action === 'new') {
                                                this.setState({
                                                    action: 'view',
                                                    annotations: [...this.state.annotations, {...this.state.currentAnnotation, id: 'annotation:' + count}]
                                                });
                                                count++;
                                            } else if (this.state.action === 'edit') {
                                                this.setState({
                                                    action: 'view',
                                                    annotations: this.state.annotations.map(annotation => annotation.id === this.state.currentAnnotation.id ? {...this.state.currentAnnotation} : {...annotation})
                                                });
                                            }
                                        } else {
                                            this.setState({
                                                warnTitle: true
                                            });
                                        }
                                    }
                                },
                                {
                                    glyph: 'zoom-to',
                                    tooltip: 'Zoom to annotation',
                                    visible: this.state.action === 'preview',
                                    onClick: () => {

                                    }
                                },
                                {
                                    glyph: 'pencil',
                                    tooltip: 'Edit annotation',
                                    warnTitle: false,
                                    visible: this.state.action === 'preview',
                                    onClick: () => {
                                        this.setState({
                                            action: 'edit'
                                        });
                                    }
                                },
                                {
                                    glyph: 'trash',
                                    tooltip: 'Delete annotation',
                                    visible: this.state.action === 'preview',
                                    onClick: () => {
                                        this.setState({
                                            showDelete: true
                                        });
                                    }
                                }
                            ]}/>
                    </Col>
                </Row>
                {this.state.action === 'view' && <Row>
                    <Col xs={12}>
                        <Filter filterPlaceholder="Filter annotations"/>
                    </Col>
                </Row>}
                {this.state.action === 'style' && <Row className="ms-style-header">
                    <Col xs={12}>
                        <Nav bsStyle="tabs" activeKey={this.state.styleType} justified>
                            <NavItemT tooltip="Marker style" eventKey="marker" onClick={() => { this.setState({ styleType: 'marker' }); }}><Glyphicon glyph="point"/></NavItemT>
                            <NavItemT tooltip="Polyline style" eventKey="line" onClick={() => { this.setState({ styleType: 'line' }); }}><Glyphicon glyph="line"/></NavItemT>
                            <NavItemT tooltip="Polygon style" eventKey="poly" onClick={() => { this.setState({ styleType: 'poly' }); }}><Glyphicon glyph="polygon"/></NavItemT>
                        </Nav>
                    </Col>
                </Row>}
            </Grid>
        );
    }

    renderNew() {
        return (
            <Grid fluid style={{ width: '100%' }} className="ms-edit">
                <Row>
                    <Col xs={12}>
                        {this.state.warnTitle && <span className="text-danger"><Glyphicon glyph="pencil-add"/>&nbsp;Geometry Required!</span>}
                        {this.state.warnTitle && <hr/>}
                    </Col>

                    <Col xs={12}>
                        Title {this.state.warnTitle && <span className="text-danger">( Required! )</span>} :
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <FormControl
                                value={this.state.currentAnnotation.title}
                                placeholder="Title"
                                onChange={e => {
                                    this.setState({
                                        warnTitle: e.target.value ? false : true,
                                        currentAnnotation: {...this.state.currentAnnotation, title: e.target.value}
                                    });
                                }}
                                type="text"/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        Description:
                    </Col>
                    <Col id="ms-ann-description-editor" xs={12}>
                        <ReactQuill
                            bounds={"#ms-ann-description-editor"}
                            value={this.state.currentAnnotation.description}
                            onChange={text => {
                                this.setState({
                                    currentAnnotation: {...this.state.currentAnnotation, description: text}
                                });
                            }}
                            />
                    </Col>
                </Row>
            </Grid>
        );
    }
    /*
    modules={{
        toolbar: [
        [{ 'size': ['small', false, 'large', 'huge'] }, 'bold', 'italic', 'underline', 'blockquote'],
        [{ 'list': 'bullet' }, { 'align': [] }],
        [{ 'color': [] }, { 'background': [] }, 'clean'], ['image', 'video', 'link']
    ]}}
    */
    renderPreview() {
        const {title, description} = this.state.currentAnnotation;
        return (
            <Grid fluid style={{ width: '100%' }} className="ms-preview">
                <Row>
                    <Col xs={12}>
                        <h4><div className="ql-editor"><strong>{title}</strong></div></h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <div className="ql-editor" dangerouslySetInnerHTML={{__html: description}} />
                    </Col>
                </Row>
            </Grid>
        );
    }

    renderStyle() {

        const shapeRenderer = (option) => (<div style={{display: 'flex', alignItems: 'center', height: 34}}><div style={{...markers[option.idx].markers[bIndexMarker].thumbnailStyle, transform: 'scale(0.5)', cursor: 'default'}}/><span> {option.label}</span></div>);
        const colorRenderer = (option) => (<div style={{display: 'flex', alignItems: 'center', height: 34}}><div style={{width: '80%', height: 20, backgroundColor: translateColor[option.value]}}/></div>);
        const glyphRenderer = (option) => (<div><span className={"fa fa-" + option.value}/><span> {option.label}</span></div>);

        const shapeIdx = markers.reduce((a, b, i) => b.name === this.state.currentAnnotation.marker.shape ? i : a, 0);
        const markerIdx = markers[shapeIdx].markers.reduce((a, b, i) => b.name === this.state.currentAnnotation.marker.color ? i : a, 0);

        switch (this.state.styleType) {
            case 'marker':
            return (<Grid fluid style={{ width: '100%', padding: '0 30px' }} className="ms-style">
                    <Row>
                        <Col xs={12}>
                            <div className="ms-marker-preview" style={{display: 'flex', width: '100%', height: 104}}>
                                <div style={{...markers[shapeIdx].markers[markerIdx].thumbnailStyle, margin: 'auto', textAlign: 'center', color: '#ffffff', cursor: 'default'}}>
                                    <span className={"fa fa-" + this.state.currentAnnotation.marker.icon} style={{marginTop: 10, marginLeft: -2}}/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Shape:
                        </Col>
                        <Col xs={6}>
                            <Select
                                clearable={false}
                                options={shapes.map((shape, idx) => ({
                                    label: shape,
                                    value: shape,
                                    idx
                                }))}
                                optionRenderer={shapeRenderer}
                                valueRenderer={shapeRenderer}
                                value={this.state.currentAnnotation.marker.shape}
                                onChange={options => {
                                    const marker = {...this.state.currentAnnotation.marker, shape: options.value};
                                    this.setState({
                                        currentAnnotation: {...this.state.currentAnnotation, marker}
                                    });
                                }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Color:
                        </Col>
                        <Col xs={6}>
                            <Select
                                clearable={false}
                                options={colors.map(color => ({
                                    label: color,
                                    value: color
                                }))}
                                optionRenderer={colorRenderer}
                                valueRenderer={colorRenderer}
                                value={this.state.currentAnnotation.marker.color}
                                onChange={options => {
                                    const marker = {...this.state.currentAnnotation.marker, color: options.value};
                                    this.setState({
                                        currentAnnotation: {...this.state.currentAnnotation, marker}
                                    });
                                }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Icon:
                        </Col>
                        <Col xs={6}>
                            <Select
                                clearable={false}
                                options={Object.keys(glyphs).map(g => ({
                                    label: g,
                                    value: g
                                }))}
                                optionRenderer={glyphRenderer}
                                valueRenderer={glyphRenderer}
                                value={this.state.currentAnnotation.marker.icon}
                                onChange={options => {
                                    const marker = {...this.state.currentAnnotation.marker, icon: options.value};
                                    this.setState({
                                        currentAnnotation: {...this.state.currentAnnotation, marker}
                                    });
                                }}/>
                        </Col>
                    </Row>
                </Grid>
            );
            case 'line':
            return (
                <Grid fluid style={{ width: '100%', padding: '0 30px' }} className="ms-style">
                    <Row>
                        <Col xs={12}>
                            <div className="ms-marker-preview" style={{display: 'flex', width: '100%', height: 104}}>
                                <div style={{width: 52, height: 1, margin: 'auto', borderTop: '5px solid #333333'}}>

                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Stroke:
                        </Col>
                        <Col xs={6} style={{position: 'static'}}>
                            <ColorSelector key="line-stroke" color={{r: 33, g: 33, b: 33, a: 100}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Stroke Width:
                        </Col>
                        <Col xs={6} style={{position: 'static'}}>
                            <div className="mapstore-slider with-tooltip">
                                <Slider tooltips start={[5]} format={{
                                           from: value => Math.round(value),
                                           to: value => Math.round(value) + ' px'
                                       }} range={{min: 0, max: 20}}/>
                                </div>
                        </Col>
                    </Row>
                </Grid>
            );
            case 'poly':
            return (
                <Grid fluid style={{ width: '100%', padding: '0 30px' }} className="ms-style">
                    <Row>
                        <Col xs={12}>
                            <div className="ms-marker-preview" style={{display: 'flex', width: '100%', height: 104}}>
                                <div style={{width: 52, height: 52, margin: 'auto', backgroundColor: '#aaff33', border: '2px solid #333333'}}>

                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Fill:
                        </Col>
                        <Col xs={6} style={{position: 'static'}}>
                            <ColorSelector key="poly-fill" color={{r: 170, g: 255, b: 51, a: 100}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Stroke:
                        </Col>
                        <Col xs={6} style={{position: 'static'}}>
                            <ColorSelector color={{r: 33, g: 33, b: 33, a: 100}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            Stroke Width:
                        </Col>
                        <Col xs={6} style={{position: 'static'}}>
                            <div className="mapstore-slider with-tooltip">
                                <Slider tooltips start={[2]} format={{
                                           from: value => Math.round(value),
                                           to: value => Math.round(value) + ' px'
                                       }} range={{min: 0, max: 20}}/>
                                </div>
                        </Col>
                    </Row>
                </Grid>
            );
            default:
            return null;
        }
    }

    render() {
        const dockProps = {
            dimMode: 'none',
            size: 0.30,
            fluid: false,
            position: 'right',
            zIndex: 1030
        };

        return (
            <span>
                <Button className="square-button shadow-soft" bsStyle="primary" style={{position: 'absolute'}}>
                    <Glyphicon glyph="1-layer"/>
                </Button>
                <span className="ms-annotations-panel">
                    <Dock dockStyle={{height: 'calc(100% - 30px)'}} {...dockProps} isVisible={this.props.open} size={500}>
                        <BorderLayout
                            header={this.renderHeader()}>
                            {this.state.action === 'view' &&
                                <SideGrid
                                    items={this.state.annotations.map(annotation => {
                                        const shapeIdx = markers.reduce((a, b, i) => b.name === annotation.marker.shape ? i : a, 0);
                                        const markerIdx = markers[shapeIdx].markers.reduce((a, b, i) => b.name === annotation.marker.color ? i : a, 0);
                                        return {
                                            ...annotation,
                                            description: <div dangerouslySetInnerHTML={{__html: annotation.description}} />,
                                            preview: <div style={{...markers[shapeIdx].markers[markerIdx].thumbnailStyle, margin: 'auto', textAlign: 'center', color: '#ffffff', cursor: 'default'}}>
                                                <span className={"fa fa-" + this.state.currentAnnotation.marker.icon} style={{marginTop: 10, marginLeft: -2}}/>
                                            </div>
                                        };
                                    })}
                                    onItemClick={annotation => {
                                        this.setState({
                                            action: 'preview',
                                            currentAnnotation: head(this.state.annotations.filter(ann => ann.id === annotation.id))
                                        });
                                    }}/>
                            }
                            {(this.state.action === 'new' || this.state.action === 'edit') && this.renderNew()}
                            {this.state.action === 'preview' && this.renderPreview()}
                            {this.state.action === 'style' && this.renderStyle()}
                        </BorderLayout>
                    </Dock>
                </span>
                <Portal>
                    <ResizableModal
                        title="Back to annotations list"
                        bodyClassName="ms-flex"
                        show={this.state.showBackModal}
                        size="xs"
                        onClose={() => {
                            this.setState({
                                showBackModal: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'No',
                                onClick: () => {
                                    this.setState({
                                        showBackModal: false
                                    });
                                }
                            },
                            {
                                text: 'Yes',
                                onClick: () => {
                                    this.setState({
                                        showBackModal: false,
                                        action: this.state.action === 'new' ? 'view' : 'preview'
                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center">
                                {this.state.action === 'new' && 'Are you sure to quit create mode?'}
                                {this.state.action === 'edit' && 'Are you sure to quit edit mode?'}
                            </div>
                        </div>
                    </ResizableModal>
                </Portal>
                <Portal>
                    <ResizableModal
                        title="Delete current annotation"
                        bodyClassName="ms-flex"
                        show={this.state.showDelete}
                        size="xs"
                        onClose={() => {
                            this.setState({
                                showDelete: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'No',
                                onClick: () => {
                                    this.setState({
                                        showDelete: false
                                    });
                                }
                            },
                            {
                                text: 'Yes',
                                onClick: () => {
                                    this.setState({
                                        showDelete: false,
                                        action: 'view',
                                        annotations: this.state.annotations.filter(annotation => annotation.id !== this.state.currentAnnotation.id)
                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center">
                                Are you sure to delete current annotation?
                            </div>
                        </div>
                    </ResizableModal>
                </Portal>
                <Portal>
                    <ResizableModal
                        title="Mock up info - Delete Geometry"
                        bodyClassName="ms-flex"
                        show={this.state.showMockDelete}
                        size="xs"
                        onClose={() => {
                            this.setState({
                                showMockDelete: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'OK',
                                onClick: () => {
                                    this.setState({
                                        showMockDelete: false
                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center">
                                <span>
                                    <p className="text-danger">NB: Not add this modal</p>
                                    <ul>
                                        <li>Disable buttons and inputs areas</li>
                                        <li>The remove geometry button will be active (success)</li>
                                        <li>Remove element by clicking the geometry on map</li>
                                        <li>Click again on remove geometry button to quit delete mode</li>
                                        <li> remove geometry button and it will be normal (primary)</li>
                                        <li>Do we need a modal to confirm the remove action?</li>

                                    </ul>
                                </span>
                            </div>
                        </div>
                    </ResizableModal>
                </Portal>

                <Portal>
                    <ResizableModal
                        title="Mock up info - Add Geometry"
                        bodyClassName="ms-flex"
                        show={this.state.showMockAdd}
                        size="xs"
                        onClose={() => {
                            this.setState({
                                showMockAdd: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'OK',
                                onClick: () => {
                                    this.setState({
                                        showMockAdd: false
                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center">
                                <span>
                                    <p className="text-danger">NB: Not add this modal</p>
                                    <ul>
                                        <li>Disable buttons and inputs areas</li>
                                        <li>Draw the geometry on map</li>
                                        <li>When geometry has been added the inputs areas will be active again</li>
                                    </ul>
                                    <p>Similar workflow of current annotation and feature grid editor</p>
                                </span>
                            </div>
                        </div>
                    </ResizableModal>
                </Portal>

                <Portal>
                    <ResizableModal
                        title="Mock up info - Hide not used tab"
                        bodyClassName="ms-flex"
                        show={this.state.showMockTab}
                        size="xs"
                        onClose={() => {
                            this.setState({
                                showMockTab: false
                            });
                        }}
                        buttons={[
                            {
                                text: 'OK',
                                onClick: () => {
                                    this.setState({
                                        showMockTab: false
                                    });
                                }
                            }
                        ]}>
                        <div className="ms-alert">
                            <div className="ms-alert-center">
                                <span>
                                    <p className="text-danger">NB: Not add this modal</p>
                                    <p>If type of geometry isn't used by annotation the corrisponding tab style should not be visible</p>
                                </span>
                            </div>
                        </div>
                    </ResizableModal>
                </Portal>
            </span>
        );
    }
}

const AnnotationsPlugin = connect(() => ({

}), {

})(Annotations);

module.exports = {
    AnnotationsPlugin
};
