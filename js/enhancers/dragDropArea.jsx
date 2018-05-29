const React = require('react');
const PropTypes = require('prop-types');
const Dropzone = require('react-dropzone');
const { compose, branch } = require('recompose');
const {Glyphicon} = require('react-bootstrap');

class DropArea extends React.Component {

    static propTypes = {
        displayDropZone: PropTypes.bool,
        controlled: PropTypes.bool,
        overlayDropZone: PropTypes.node,
        onDrop: PropTypes.func
    };

    state = {};

    onDragEnter = () => {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave = () => {
        this.setState({
            dropzoneActive: false
        });
    }

    onDrop = (files) => {
        this.props.onDrop(files);
        this.setState({
            files,
            dropzoneActive: false
        });
    }

    render() {
        const { accept, dropzoneActive } = this.state;
        const {displayDropZone, controlled, overlayDropZone} = this.props;
        return (
            <Dropzone
                disableClick
                style={{ position: "relative", height: '100%' }}
                accept={accept}
                onDrop={(!controlled || controlled && displayDropZone) ? this.onDrop : () => {}}
                onDragEnter={(!controlled || controlled && displayDropZone) ? this.onDragEnter : () => {}}
                onDragLeave={(!controlled || controlled && displayDropZone) ? this.onDragLeave : () => {}}>

                {(dropzoneActive && !controlled || displayDropZone && controlled) &&
                    (overlayDropZone ||
                    <div
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
                        }}>
                        <div style={{
                            margin: 'auto',
                            maxWidth: 550
                        }}>
                            <div>
                                <Glyphicon
                                    glyph="import"
                                    style={{
                                        fontSize: 80
                                    }}/>
                            </div>
                        </div>
                    </div>)
                }
                {this.props.children}
            </Dropzone>
        );
    }
}

module.exports = compose(
    branch(
        ({ dropArea }) => dropArea,
        Component => ({onDrop = () => {}, displayDropZone, overlayDropZone, controlled, ...props }) => (
            <DropArea
                controlled={controlled}
                displayDropZone={displayDropZone}
                overlayDropZone={overlayDropZone}
                onDrop={onDrop}>
                <Component {...props} />
            </DropArea>)
    )
);
