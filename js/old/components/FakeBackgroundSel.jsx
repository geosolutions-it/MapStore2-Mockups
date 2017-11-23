const React = require('react');
const PropTypes = require('prop-types');

class FakeBackgroundSel extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func
    };

    static defaultProps = {
        onSelect: () => {}
    };

    state = {
        open: true,
        selected: false
    }

    render() {

        return (
            null

        );
    }
}

/*<span>
<div className="background-plugin-position" style={{position: 'absolute', left: 0, bottom: '50px'}}>
    <div className="background-preview-button" style={{margin: '5px'}}>
        <div className="background-preview-button-container bg-body"style={{padding: '3px', width: '78px', height: '78px'}} >
            <div className="background-preview-button-label" style={{width: '72px', height: '0px', marginTop: '0px', padding: '0px'}}>
                <div className="bg-body bg-text" style={{padding: '6px'}}>Open Street Map</div>
            </div>
            <div className="background-preview-button-frame" style={{width: '72px', height: '72px'}}>
                <img src="/mapstore/dist/web/client/plugins/background/assets/img/mapnik.jpg"/></div>
        </div>
    </div>
    <div className="background-list-container" style={{left: '88px', width: '0px', height: '83px'}}>
        <div style={{height: '83px', width: '0px', bottom: '0px'}}></div>
    </div>
</div></span>*/

module.exports = FakeBackgroundSel;
