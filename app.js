let { KMeans, KMeansOptimizer, XMeans } = require('kmeans');
let React = require('react');
let ReactDOM = require('react-dom');

let DataPoint = function (props) {
    return (
        <div style={{
            position: 'absolute',
            backgroundColor: props.color,
            borderRadius: props.size || "5px",
            width: props.size || "5px",
            height: props.size || "5px",
            'top': Math.round(props.y),
            left: Math.round(props.x)
            }}>
        </div>
    );
}

let NormalDistribution2D = function(props) {
    let cs = props.color;
    let color = `rgba(${cs[0]}, ${cs[1]}, ${cs[2]}, ${'3' in cs ? cs[3] : 1})`;
    return (
        <div>
            {props.data.map((pt, i) =>
                (<DataPoint key={i}
                    size={props.size}
                    color={color}
                    x={pt[0]}
                    y={pt[1]} />)
            )}
        </div>
    );
}

var LossChooser = function (props) {
    return (
        <label>Loss
            <select onChange={props.onChange} defaultValue={props.loss}>
                <option value="bic">BIC</option>
                <option value="aic">AIC</option>
                <option value="mse">MSE</option>
            </select>
        </label>
    );
}

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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {distribs: []};
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    generateParams(np) {
        let ds = [];
        for (let i = 0; i < np.distribs; ++i) {
            ds.push({
                samples: Math.round(100 * Math.random()),
                muX: Math.random() * np.width,
                muY: Math.random() * np.height,
                sigmaX: 500 * Math.random(),
                sigmaY: 500 * Math.random(),
                color: [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ]
            });
        }
        return ds;
    }

    generateData(props) {
        return (Array.from(new Array(props.samples), () => {
            return [
                this.rnd(props.muX, props.sigmaX),
                this.rnd(props.muY, props.sigmaY)
            ];
        }));
    }

    startXMeans(mixedData, params) {
        window.clearTimeout(this.xmCb);
        this.xm = new XMeans(mixedData, params.mink, params.maxk, params.loss);
        let res = this.xm.getRes();
        this.xmCb = setTimeout(() => this.optimizeXM(), 0);
    }

    startKMeans(mixedData, params) {
        window.clearTimeout(this.kmCb);
        this.km = new KMeansOptimizer(params.maxk,
                                        params.tries,
                                        mixedData,
                                        params.loss,
                                        params.selector);
        this.kmCb = setTimeout(() => this.optimizeKM(), 0);
    }

    componentWillReceiveProps(np) {
        this.start(np);
    }

    start(np) {
        let ds = this.generateParams(np);
        let data = ds.map(props => this.generateData(props));

        this.mixedData = [].concat.apply([], data);
        this.setState({
            distribs: ds,
            data: data,
            kmRes: [],
            xmRes: []
        });
    }

    optimizeKM() {
        let st = this.state;
        if (this.km.ended()) {
            st.kmRes = this.km.getRes().centroids;
            this.setState(st);
            return;
        }
        this.km.step();
        this.kmCb = setTimeout(() => this.optimizeKM(), 0);
    }

    optimizeXM() {
        if (this.xm.ended()) {
            console.log('K FOR XM: ' + this.state.xmRes.length);
            return;
        }
        this.xm.step();
        let st = this.state;
        st.xmRes = this.xm.getRes().centroids;
        this.setState(st);
        this.xmCb = setTimeout(() => this.optimizeXM(), 50);
    }

    rnd(mu, sigma) {
        let t = 0;
        let n = 8;
        for (let i = 0; i < n; ++i) {
            t += Math.random();
        }
        return (t - (n / 2)) / (n / 2) * sigma + mu;
    }

    onXMParamsChange(params) {
        this.startXMeans(this.mixedData, params);
    }

    onKMParamsChange(params) {
        this.startKMeans(this.mixedData, params);
    }

    regenerateData() {
        this.start(this.props);
    }

    render() {
        return (
            <div>
                <div style={{float: 'right', width: 200}}>
                    <div>Green: K-Means</div>
                    <div>Red: X-Means</div>
                    <button onClick={() => this.regenerateData()}>
                        Generate Data
                    </button>
                    <XMeansParams onChange={p => this.onXMParamsChange(p)}/>
                    <KMeansParams onChange={p => this.onKMParamsChange(p)}/>
                    <a href="https://github.com/Vermeille/KMeans">
                        Based on Vermeille/KMeans
                    </a>
                </div>
                <div style={{position: 'relative',
                            borderStyle: 'solid',
                            width: this.props.width,
                            height: this.props.height
                            }} >
                    {this.state.distribs.map((d, i) =>
                        (<NormalDistribution2D
                            key={i}
                            color={d.color}
                            data={this.state.data[i]} />)
                    )}
                    <NormalDistribution2D
                            size="30px"
                            color={[0, 255, 0]}
                            data={this.state.kmRes} />
                    <NormalDistribution2D
                            size="30px"
                            color={[255, 0, 0, 0.5]}
                            data={this.state.xmRes} />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App height="800" width="900" distribs={5}/>,
    document.getElementById('app')
);
