
const React = require('react');
const PropTypes = require('prop-types');
const FakeToolbar = require('../FakeToolbar');
const FakeFooter = require('../FakeFooter');
const FakeNavbar = require('../FakeNavbar');
const StyleEditor = require('./StyleEditor');
const FakeBackgroundSel = require('../FakeBackgroundSel');
const {BackgroundPlugin} = require('../../../plugins/Background');

class Side extends React.Component {

    static propTypes = {
        id: PropTypes.string
    };

    static defaultProps = {
        id: ''
    };

    render() {
        return (<span><FakeToolbar/>
        <BackgroundPlugin />
        <FakeFooter/>
        <FakeBackgroundSel/>
        <FakeNavbar/>
            <StyleEditor/>
        </span>);
    }
}

module.exports = Side;
