'use strict';

import {AdminUI} from './adminUI';
import {StandartUI} from './standartUI';

const React = require('react');
const ReactDOM = require('react-dom');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {role: ""};
	}

	componentDidMount() {
		fetch("./getUserRole")
		.then(res => res.json())
		.then(
			(result) => {
				this.setState(
					{role: result.role}
				);
			}
		)
	}

	render() {
		if(this.state.role === 'ADMIN') {
			return (
				<AdminUI />
			);
		} else if(this.state.role === 'USER') {
			return (
				<StandartUI />
			);
		} else {
			return (
				<h1>Да кто ты, чёрт побери, такой?!</h1>
			);
		}
	} 
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)