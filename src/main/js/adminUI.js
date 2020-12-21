'use strict';

import {EmployeePage} from './employeePage';
import {FilmPage} from './filmPage';
import {FilmSessionPage} from './filmSessionPage';
import {TicketPage} from './ticketPage';
import {SchedulePage} from './schedulePage';

const React = require('react');

export class AdminUI extends React.Component {

	constructor(props) {
		super(props);
		this.state = {component: 'employees',
	role: ""};
		this.getEmployees = this.getEmployees.bind(this);
		this.getFilms = this.getFilms.bind(this);
		this.getFilmSessions = this.getFilmSessions.bind(this);
		this.getTickets = this.getTickets.bind(this);
		this.getSchedule = this.getSchedule.bind(this);
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

	getSchedule() {
		this.setState({component: 'schedule'});
	}

	render() {
		if(this.state.component === 'employees') {
			return (
				<div>
					<button className="disabled" style={{verticalAlign:"middle"}} onClick={this.getEmployees} disabled><span>Сотрудники</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilms}><span>Фильмы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilmSessions}><span>Сеансы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getTickets}><span>Билеты</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getSchedule}><span>Расписание</span></button>
					<EmployeePage />
				</div>
			);
		} else if(this.state.component === 'films') {
			return (
				<div>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getEmployees}><span>Сотрудники</span></button>
					<button className="disabled" style={{verticalAlign:"middle"}} onClick={this.getFilms} disabled><span>Фильмы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilmSessions}><span>Сеансы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getTickets}><span>Билеты</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getSchedule}><span>Расписание</span></button>
					<FilmPage />
				</div>
			);
		} else if(this.state.component === 'filmSessions') {
			return (
				<div>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getEmployees}><span>Сотрудники</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilms}><span>Фильмы</span></button>
					<button className="disabled" style={{verticalAlign:"middle"}} onClick={this.getFilmSessions} disabled><span>Сеансы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getTickets}><span>Билеты</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getSchedule}><span>Расписание</span></button>
					<FilmSessionPage />
				</div>
			);
		} else if(this.state.component === 'tickets') {
			return (
				<div>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getEmployees}><span>Сотрудники</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilms}><span>Фильмы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilmSessions}><span>Сеансы</span></button>
					<button className="disabled" style={{verticalAlign:"middle"}} onClick={this.getTickets} disabled><span>Билеты</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getSchedule}><span>Расписание</span></button>
					<TicketPage />
				</div>
			);
		} else if(this.state.component === 'schedule') {
			return (
				<div>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getEmployees}><span>Сотрудники</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilms}><span>Фильмы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilmSessions}><span>Сеансы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getTickets}><span>Билеты</span></button>
					<button className="disabled" style={{verticalAlign:"middle"}} onClick={this.getSchedule} disabled><span>Расписание</span></button>
					<SchedulePage />
				</div>
			);
		}
	} 
}