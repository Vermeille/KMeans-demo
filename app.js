const { KMeans, KMeansOptimizer, XMeans } = require('kmeans');
const React = require('react');
const ReactDOM = require('react-dom');
const ParamsUI = require('./src/ParamsUI.js');
const GaussianSampler = require('./src/GaussianSampler.js');
const NormalDistribution2D = require('./src/NormalDistribution2D.js');

class SampleGaussian extends React.Component {
    constructor(props) {
        super(props);
        this.data;
    }

    _sample(props) {
        let { width, height, samples, distribs, seed } = props;
        if (seed == this.seed) {
            return this.data;
        }
        this.seed = seed;
        let data = GaussianSampler.sample(width, height, samples, distribs);
        this.data = data;
        return data;
    }

    render() {
        let res = this._sample(this.props);
        return this.props.children(res);
    }
};

class XMeansCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _startXMeans(mixedData, params) {
        window.clearTimeout(this.xmCb);

        this.xm = new XMeans(mixedData, params.mink, params.maxk, params.loss);
        let res = this.xm.getRes();
        this.xmCb = setTimeout(() => this._optimizeXM(), 0);
    }

    _optimizeXM() {
        if (this.xm.ended()) {
            return;
        }
        this.xm.step();
        let st = this.state;
        st.centroids = this.xm.getRes().centroids;
        this.setState(st);
        this.xmCb = setTimeout(() => this._optimizeXM(), 50);
    }

    runXMeans(data, params) {
        if (this.props.seed === this.seed) {
            return this.state;
        }
        this.seed = this.props.seed;
        this._startXMeans(data, params);
    }

    render() {
        this.runXMeans(this.props.data, this.props.params);
        return this.props.children(this.state);
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {seed: 0};
        this.onXMParamsChange = this.onXMParamsChange.bind(this);
        this.onKMParamsChange = this.onKMParamsChange.bind(this);
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
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
        //this.start(np);
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

    onXMParamsChange(params) {
        let st = this.state;
        st.xmParams = params;
        st.xmSeed = (st.xmSeed || 0) + 1;
        this.setState(st);
    }

    regenData() {
        let st = this.state;
        st.seed = (st.seed || 0) + 1;
        this.setState(st);
    }

    onKMParamsChange(params) {
        this.startKMeans(this.mixedData, params);
    }

    render() {
        return (
            <div>
                <ParamsUI
                    onGenData={() => this.regenData()}
                    onXParamsChange={this.onXMParamsChange}
                    onKParamsChange={this.onKMParamsChange} />

                <SampleGaussian
                    width={this.props.width}
                    height={this.props.height}
                    samples={this.props.samples}
                    distribs={this.props.distribs}
                    seed={this.state.seed}>

                        {({distribs, data, mixedData}) =>
                            <div style={{position: 'relative',
                                        borderStyle: 'solid',
                                        width: this.props.width,
                                        height: this.props.height
                                        }} >
                                {distribs.map((d, i) =>
                                    (<NormalDistribution2D
                                        key={i}
                                        color={d.color}
                                        data={data[i] || []} />)
                                )}
                                <NormalDistribution2D
                                        size="30px"
                                        color={[0, 255, 0]}
                                        data={this.state.kmRes || []} />
                                {this.state.xmParams &&
                                    <XMeansCalculator
                                        data={mixedData}
                                        seed={this.state.xmSeed}
                                        params={this.state.xmParams}>
                                        {({centroids }) =>
                                            <NormalDistribution2D
                                                    size="30px"
                                                    color={[255, 0, 0, 0.5]}
                                                    data={centroids || []} />
                                        }
                                    </XMeansCalculator>
                                }
                            </div>
                        }
                </SampleGaussian>
            </div>
        );
    }
}

ReactDOM.render(
    <App height={800} width={900} samples={100} distribs={5}/>,
    document.getElementById('app')
);
