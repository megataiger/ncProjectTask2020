'use strict';

import {EmployeePage} from './employeePage';
import {FilmPage} from './filmPage';
import {FilmSessionPage} from './filmSessionPage';
import {TicketPage} from './ticketPage';

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
const client = require('./client'); // <3>
// end::vars[]

// tag::app[]
class App extends React.Component { // <1>

	constructor(props) {
		super(props);
		this.state = {component: 'employees',
	role: ""};
		this.getEmployees = this.getEmployees.bind(this);
		this.getFilms = this.getFilms.bind(this);
		this.getFilmSessions = this.getFilmSessions.bind(this);
		this.getTickets = this.getTickets.bind(this);
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

	getEmployees() {
		this.setState({component: 'employees'});
	}

	getFilms() {
		this.setState({component: 'films'});
	}

	getFilmSessions() {
		this.setState({component: 'filmSessions'});
	}

	getTickets() {
		this.setState({component: 'tickets'});
	}

	render() { // <3>
		if(this.state.component === 'employees') {
		return (
			<div>
				<button onClick={this.getEmployees} disabled>Employees</button>
				<button onClick={this.getFilms}>Films</button>
				<button onClick={this.getFilmSessions}>FilmSessions</button>
				<button onClick={this.getTickets}>Tickets</button>
				<EmployeePage />
			</div>
		);
		} else if(this.state.component === 'films') {
			return (
				<div>
					<button onClick={this.getEmployees}>Employees</button>
					<button onClick={this.getFilms} disabled>Films</button>
					<button onClick={this.getFilmSessions}>FilmSessions</button>
					<button onClick={this.getTickets}>Tickets</button>
					<FilmPage />
				</div>
			);
		} else if(this.state.component === 'filmSessions') {
			return (
				<div>
					<button onClick={this.getEmployees}>Employees</button>
					<button onClick={this.getFilms}>Films</button>
					<button onClick={this.getFilmSessions} disabled>FilmSessions</button>
					<button onClick={this.getTickets}>Tickets</button>
					<FilmSessionPage />
				</div>
			);
		} else if(this.state.component === 'tickets') {
			return (
				<div>
					<button onClick={this.getEmployees}>Employees</button>
					<button onClick={this.getFilms}>Films</button>
					<button onClick={this.getFilmSessions}>FilmSessions</button>
					<button onClick={this.getTickets} disabled>Tickets</button>
					<TicketPage />
				</div>
			);
		}
	}
}
// end::app[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]
