const React = require('react');
const PropTypes = require('prop-types');
// const ComponentViewer = require('../components/ComponentViewer');
const ResizableModal = require('../components/ResizableModal');
const {Button} = require('react-bootstrap');
const BorderLayout = require('../../old_ms2_226bfec4/web/client/components/layout/BorderLayout');
const Filter = require('../../old_ms2_226bfec4/web/client/components/misc/Filter');
// const Portal = require('../../old_ms2_226bfec4/web/client/components/misc/Portal');

class ComponentsArchive extends React.Component {
    static propTypes = {
        code: PropTypes.string
    };

    static defaultProps = {
        code: ''
    };

    state = {}

    renderHeader() {
        return (
            <div className="mapstore-header-no-fix">
                <div className="m-left">
                    <div className="ms-logo-title">
                        <a href="#">
                            <div>MapStore Components / Class</div>
                        </a>
                    </div>
                </div>
                <div className="m-right">
                    <Filter filterPlaceholder="Filter components..." />
                </div>
            </div>
        );
    }

    render() {

        const componentsList = [{
            title: 'Hello',
            component: (
                <div>hello</div>
            )
        }, {
            title: 'ResizableModal',
            component: (
                <div>
                    <Button onClick={() => { this.setState({ smallModal: !this.state.smallModal }); }}>{this.state.smallModal ? 'Close' : 'Open'} small modal</Button>

                    <div className="ms-container">
                        <ResizableModal
                            size="sm"
                            show={this.state.smallModal}>
                            Small Modal
                        </ResizableModal>
                    </div>
                </div>
            )
        }];

        return (
            <div className="ms-components-archive">
                <BorderLayout header={this.renderHeader()}>
                    {/*componentsList.map(c => <ComponentViewer title={c.title} code={c.component}/>)*/}
                </BorderLayout>
            </div>
        );
    }
}

module.exports = {
    ComponentsArchivePlugin: ComponentsArchive
};
