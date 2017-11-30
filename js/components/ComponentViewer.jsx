const React = require('react');
const PropTypes = require('prop-types');
const jsxToString = require('jsx-to-string');

class ComponentViewer extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        code: PropTypes.object
    };

    static defaultProps = {
        title: '',
        code: <span/>
    };

    renderCode() {
        return (<pre>{jsxToString({...this.props.code}) || ''}</pre>);
    }

    render() {
        return (
            <span className="ms-components-conatiner">
                <h2 className="ms-components-title">{this.props.title}</h2>
                <div className="ms-components-body">
                    <div>
                        {this.props.code}
                    </div>
                    <div>
                        {this.renderCode()}
                    </div>
                </div>
            </span>
        );
    }
}

module.exports = ComponentViewer;
