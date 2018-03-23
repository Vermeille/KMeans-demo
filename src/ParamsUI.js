const React = require('react');

const KMeansParams = require('./KMeansParams.js');
const XMeansParams = require('./XMeansParams.js');

const ParamsUI = ({onGenData, onXParamsChange, onKParamsChange}) => (
    <div style={{float: 'right', width: 200}}>
        <div>Green: K-Means</div>
        <div>Red: X-Means</div>
        <button onClick={onGenData}>
            Generate Data
        </button>
        <XMeansParams onChange={onXParamsChange}/>
        <KMeansParams onChange={onKParamsChange}/>
        <a href="https://github.com/Vermeille/KMeans">
            Based on Vermeille/KMeans
        </a>
    </div>
);

module.exports = ParamsUI;
