const React = require('react');

const DataPoint = function (props) {
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

module.exports = DataPoint;
