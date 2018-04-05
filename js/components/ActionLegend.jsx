const React = require('react');
const PropTypes = require('prop-types');
// const BorderLayout = require('../../MapStore2/web/client/components/layout/BorderLayout');
const SideGrid = require('./maps-from-MapStore2/action-legend/cardgrids/SideGrid');
const {Grid, Col, Row, Glyphicon, Button, Panel} = require('react-bootstrap');
const Slider = require('react-nouislider');
const {isNil} = require('lodash');

const legendsImg = {
    'layer:01': require('../plugins/dashboard/img/legend-r.png'),
    'layer:02': require('../../assets/img/usa-legend.png'),
    'layer:03': require('../../assets/img/unesco-legend.png')
};


class ActionLegend extends React.Component {

    static propTypes = {
        layers: PropTypes.array,
        onChange: PropTypes.func
    };

    static defaultProps = {
        layers: [],
        onChange: () => {}
    };

    state = {
        collapsed: false
    };

    renderHeader() {
        return (
            <Grid fluid>
            <Row>
                <Col xs={9}>
                    <h5>Legend</h5>
                </Col>
                <Col xs={3} style={{padding: 4}}>
                    <Button
                        className="pull-right no-border square-button-md"
                        onClick={() => {
                            this.setState({
                                collapsed: !this.state.collapsed
                            });
                        }}>
                        <Glyphicon glyph={this.state.collapsed ? "chevron-down" : "chevron-left"} />
                    </Button>
                </Col>
                </Row>
            </Grid>
        );
    }

    renderCardBody(layer) {
        return (
            <span>
                <Grid fluid>
                    <Row>
                        <Col xs={12}>
                            <img
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    marginLeft: 24,
                                    marginBottom: 10
                                }}
                                src={legendsImg[layer.id]}/>
                            </Col>
                    </Row>
                </Grid>
                <div className="mapstore-slider" onClick={(e) => { e.stopPropagation(); }}>
                    <Slider
                    disabled={!layer.visibility}
                    start={[isNil(layer.opacity) ? 100 : layer.opacity * 100 ]}
                    range={{min: 0, max: 100}}
                    onChange={(value) => {
                        this.props.onChange(layer.id, 'opacity', (value[0] / 100).toFixed(2));
                    }}/>
                </div>
            </span>
        );
    }

    render() {
        return (
                <Panel
                    className="ms-action-legend"
                    collapsible
                    header={this.renderHeader()}
                    expanded={this.state.collapsed}>
                    <SideGrid
                        size="sm"
                        items={
                            this.props.layers.filter(layer => !layer.loadingError).map(layer => ({
                                title: layer.title,
                                preview: <Glyphicon glyph={layer.visibility ? 'eye-open' : 'eye-close'} onClick={() => this.props.onChange(layer.id, 'visibility', !layer.visibility)}/>,
                                className: layer.visibility ? '' : ' ms-no-visible',
                                body: layer.visibility ? this.renderCardBody(layer) : null
                            }))}/>
                </Panel>
        );
    }
}

module.exports = ActionLegend;
