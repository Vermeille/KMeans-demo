const React = require('react');

const { repeat } = require('./utils.js');

class GaussianSampler {
    static _generateParams(width, height) {
        return {
            samples: Math.round(100 * Math.random()),
            muX: Math.random() * width,
            muY: Math.random() * height,
            sigmaX: 500 * Math.random(),
            sigmaY: 500 * Math.random(),
            color: [
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255)
            ]
        };
    }

    static _rnd(mu, sigma) {
        let t = 0;
        let n = 8;
        for (let i = 0; i < n; ++i) {
            t += Math.random();
        }
        return (t - (n / 2)) / (n / 2) * sigma + mu;
    }

    static _generateData(props) {
        return (Array.from(new Array(props.samples), () => {
            return [
                GaussianSampler._rnd(props.muX, props.sigmaX),
                GaussianSampler._rnd(props.muY, props.sigmaY)
            ];
        }));
    }

    static sample(width, height, samples, distribs) {
        let ds = repeat(distribs,
                _ => GaussianSampler._generateParams(width, height));

        let data = ds.map(
                props => GaussianSampler._generateData(props));

        return {
            distribs: ds,
            data: data,
            mixedData: [].concat.apply([], data)
        };
    }
}

module.exports = GaussianSampler;
