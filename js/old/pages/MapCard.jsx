const React = require('react');
const PropTypes = require('prop-types');

const {Grid, Row, Col} = require('react-bootstrap');

class MapCard extends React.Component {

    static propTypes = {
        id: PropTypes.string,
        side: PropTypes.number,
        title: PropTypes.string,
        desc: PropTypes.string,
        src: PropTypes.string,
        link: PropTypes.string
    };

    static defaultProps = {
        id: '',
        side: 256,
        title: '',
        desc: '',
        src: '0.png',
        link: ''
    };
    componentDidMount() {

    }
    render() {
        const {side} = this.props;
        return (
            <a href={'#/' + this.props.link}>
            <div className="mapstore-archive-card" style={{width: side, height: side}} >
                <img src={require('../../assets/img/' + this.props.src)} style={{width: side}}/>
                <div className="mapstore-archive-card-info" style={{width: side, height: (side * 1 / 3), marginTop: side * 2 / 3}}>

                    <Grid fluid>
                        <Row>
                            <Col xs={12}>
                                <div className="mapstore-archive-card-title">
                                    {this.props.title}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <div className="mapstore-archive-card-desc">
                                    {this.props.desc}
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
            </a>
        );
    }
}

module.exports = MapCard;
