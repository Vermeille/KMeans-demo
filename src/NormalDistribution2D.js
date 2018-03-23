const React = require('react');
const DataPoint = require('./DataPoint.js');

const NormalDistribution2D = function(props) {
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

module.exports = NormalDistribution2D;
