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
const MapGrid = require('../../MapStore2/web/client/components/maps/MapGrid');
const {Modal, Row, Col, Grid, ButtonGroup, Button} = require('react-bootstrap');
const Thumbnail = require('../../MapStore2/web/client/components/maps/forms/Thumbnail');
const Metadata = require('../../MapStore2/web/client/components/maps/forms/Metadata');
const Toolbar = require('../../MapStore2/web/client/components/misc/toolbar/Toolbar');
const PermissionEditor = require('../components/PermissionEditor');
const ReactQuill = require('react-quill');
require('react-quill/dist/quill.snow.css');
class MapArchivePlugin extends React.Component {

    static propTypes = {
        maps: PropTypes.array
    };

    static defaultProps = {
        maps: [{id: 0, canEdit: true, title: 'Hello Map', description: 'My first map'} /*, {id: 1}, {id: 2}*/]
    };

    state = {
        openProperties: true
    };

    render() {
        return (
            <div className="mapstore-body">
                <BorderLayout
                    columns={[/*<div style={{order: -1}}>Abc</div>*/]}>
                    <MapGrid editMap={() => {
                        this.setState({
                            openProperties: true
                        });
                    }} maps={this.props.maps} colProps={{className: 'm-grid-cols', xs: 12, sm: 6, md: 3}}/>
                    <Modal show={this.state.openProperties && !this.state.showDetailEditor && !this.state.changesModal}>
                        <Modal.Header closeButton onHide={() => {
                            this.setState({
                                changesModal: !!this.state.text,
                                openProperties: false
                            });
                        }}>
                            <Modal.Title>Edit Map Properties</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="ms-flex">
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
                                <div className={"ms-section" + (this.state.text ? ' ms-transition' : '')}>

                                <div className="mapstore-block-width">
                                    <Row>
                                        <Col xs={6}>
                                            <div className="m-label">
                                                {!this.state.text ? 'Add New Details Sheet' : 'Details Sheet'}
                                            </div>
                                        </Col>
                                        <Col xs={6}>


                                    <div className="ms-details-sheet">

                                        <div style={{overflow: 'hidden'}}>

                                            <div className="pull-right">
                                                <Toolbar
                                                    btnDefaultProps={{ className: 'square-button-md no-border'}}
                                                    buttons={[{
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
                                                        visible: !this.state.text,
                                                        onClick: () => {
                                                            this.setState({
                                                                showDetailEditor: true,
                                                                removedText: ''
                                                            });
                                                        }
                                                    }, {
                                                        glyph: 'pencil',
                                                        tooltip: 'Edit details sheet',
                                                        visible: !!this.state.text,
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

                                        </div>
                                    </Col>
                                </Row>
                                {this.state.text && <div className="ms-details-preview" dangerouslySetInnerHTML={{ __html: this.state.text }} />}
                                    </div>
                                </div>
                                </div>
                                <div className="ms-permissions-container">
                                    <Row>
                                        <Col xs={12}>
                                            <PermissionEditor />
                                        </Col>
                                    </Row>
                                </div>
                            </Grid>
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonGroup>
                                <Button onClick={() => {
                                    this.setState({
                                        changesModal: !!this.state.text,
                                        openProperties: false
                                    });
                                }}>
                                    Close
                                </Button>
                                <Button onClick={() => {
                                    this.setState({
                                        openProperties: false
                                    });
                                }}>
                                    Save
                                </Button>
                            </ButtonGroup>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={this.state.showDetailEditor}>
                        <Modal.Header>
                            <Modal.Title>Details Sheet</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="ms-details-editor-body">
                            <ReactQuill
                                bounds={".ms-details-editor-body"}
                                value={this.state.text || ''}
                                onChange={(text) => {
                                    this.setState({
                                        text
                                    });
                                }}
                                modules={{ toolbar: [
                                    [{ 'size': ['small', false, 'large', 'huge'] }, 'bold', 'italic', 'underline', 'blockquote'],
                                    [{ 'list': 'bullet' }, { 'align': [] }],
                                    [{ 'color': [] }, 'clean'], ['image', 'video']
                                ]}}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonGroup>
                                <Button onClick={() => {
                                    this.setState({
                                        showDetailEditor: false,
                                        addNewDetail: false
                                    });
                                }}>
                                    Back
                                </Button>
                                <Button onClick={() => {
                                    this.setState({
                                        showDetailEditor: false,
                                        addNewDetail: this.state.text
                                    });
                                }}>
                                    Save
                                </Button>
                            </ButtonGroup>
                        </Modal.Footer>
                    </Modal>


                    <Modal show={this.state.changesModal} dialogClassName="ms-modal-sm">
                        <Modal.Header >
                            <Modal.Title>Are you sure to exit without save your changes?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Grid fluid>
                                <Row>
                                    {/*<Col xs={12}>
                                        - Thumbnail
                                    </Col>
                                    <Col xs={12}>
                                        - Title
                                    </Col>
                                    <Col xs={12}>
                                        - Description
                                    </Col>*/}
                                    {this.state.text &&
                                        <Col xs={12}>
                                            - <strong>Details Sheet</strong> has been changed
                                        </Col>
                                    }
                                    {/*<Col xs={12}>
                                        - Group Properties
                                    </Col>*/}
                                </Row>

                            </Grid>
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonGroup>
                                <Button onClick={() => {
                                    this.setState({
                                        changesModal: false,
                                        openProperties: true
                                    });
                                }}>
                                    No
                                </Button>
                                <Button onClick={() => {
                                    this.setState({
                                        changesModal: false,
                                        openProperties: false
                                    });
                                }}>
                                    Yes
                                </Button>
                            </ButtonGroup>
                        </Modal.Footer>
                    </Modal>
                </BorderLayout>
            </div>
        );
    }
}

module.exports = {
    MapArchivePlugin
};
