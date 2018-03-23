const React = require('react');

const LossChooser = function (props) {
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

module.exports = LossChooser;
