const React = require('react');
const LossChooser = require('./LossChooser.js');

class XMeansParams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loss: 'bic',
            maxk: 100,
            mink: 1
        };

        this.onLossChange.bind(this);
        this.onMaxKChange.bind(this);
        this.onMinKChange.bind(this);
    }

    onLossChange(e) {
        let st = this.state;
        st.loss = e.target.value;
        this.setState(st);
    }

    onMaxKChange(e) {
        let st = this.state;
        st.maxk = e.target.value;
        this.setState(st);
    }

    onMinKChange() {
        let st = this.state;
        st.mink = e.target.value;
        this.setState(st);
    }

    onClick() {
        this.props.onChange(this.state);
    }

    render() {
        return (
            <div>
                <h3>X-Means</h3>
                <LossChooser
                    onChange={(e) => this.onLossChange(e)}
                    loss={this.state.loss} />
                <br/>
                <label>
                    Max K
                    <input
                        onChange={(e) => this.onMaxKChange(e)}
                        size="3"
                        type="number"
                        value={this.state.maxk}/>
                </label>
                <br/>
                <label>
                    Min K
                    <input
                        onChange={(e) => this.onMinKChange(e)}
                        size="3"
                        type="number"
                        value={this.state.mink}/>
                </label>
                <br/>
                <button onClick={() => this.onClick()}>Go</button>
            </div>
        );
    }
}

module.exports = XMeansParams;
