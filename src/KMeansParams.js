const React = require('react');
const LossChooser = require('./LossChooser.js');

class KMeansParams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loss: 'bic',
            maxk: 10,
            tries: 100,
            selector: 'd2'
        };

        this.onLossChange.bind(this);
        this.onMaxKChange.bind(this);
        this.onTriesChange.bind(this);
        this.onSelectorChange.bind(this);
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

    onTriesChange(e) {
        let st = this.state;
        st.tries = e.target.value;
        this.setState(st);
    }

    onSelectorChange(e) {
        let st = this.state;
        st.selector = e.target.value;
        this.setState(st);
    }

    onClick() {
        this.props.onChange(this.state);
    }

    render() {
        return (
            <div>
                <h3>K-Means</h3>
                <LossChooser
                    onChange={(e) => this.onLossChange(e)}
                    loss={this.state.loss} />
                <br/>
                <label>Selector
                    <select
                        onChange={e => this.onSelectorChange(e)}
                        defaultValue={this.state.selector}>
                        <option value="d2">Elbow</option>
                        <option value="best">Best</option>
                    </select>
                </label>
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
                    Tries per K
                    <input
                        onChange={(e) => this.onTriesChange(e)}
                        size="3"
                        type="number"
                        value={this.state.tries}/>
                </label>
                <br/>
                <button onClick={() => this.onClick()}>Go</button>
            </div>
        );
    }
}

module.exports = KMeansParams;
