import React, { Component } from "react";
import { Line, Circle } from "rc-progress";
import "rc-progress/assets/index.css";
import "./Progress.css";

const percentage = 66;

export default class Prog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			percent: 30,
			color: "#3FC7FA"
		};
		this.changeState = this.changeState.bind(this);
	}

	changeState() {
		const colorMap = ["#3FC7FA", "#85D262", "#FE8C6A"];
		const value = parseInt(Math.random() * 100, 10);
		this.setState({
			percent: value,
			color: colorMap[parseInt(Math.random() * 3, 10)]
		});
	}

	render() {
		const containerStyle = {
			width: "200px"
		};

		return (
			<div>
				<h5> Completed {this.state.percent}%</h5>
				<Line
					percent={this.state.percent}
					strokeWidth="4"
					strokeColor={this.state.color}
				/>
			</div>
		);
	}
}