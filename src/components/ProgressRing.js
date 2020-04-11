// @flow
import React from 'react';

type ProgressRingProps = {|
    radius: number,
    stroke: number,
    progress: number
|}

class ProgressRing extends React.Component<ProgressRingProps> {

    render() {
        const { radius, stroke, progress } = this.props;
        const normalizedRadius = radius - stroke * 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDashoffset = circumference - progress / 100 * circumference;

        return (
            <svg
                className={"progress__ring"}
                height={radius * 2}
                width={radius * 2}
            >
                <circle
                    stroke="#4991E5"
                    fill="transparent"
                    strokeWidth={ stroke }
                    strokeDasharray={ circumference + ' ' + circumference }
                    style={ { strokeDashoffset } }
                    r={ normalizedRadius }
                    cx={ radius }
                    cy={ radius }
                />
            </svg>
        );
    }
}
export default ProgressRing;