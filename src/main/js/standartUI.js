'use strict';

import {FilmPage} from './filmPage';
import {TicketPage} from './ticketPage';
import {SchedulePage} from './schedulePage';

const React = require('react');

export class StandartUI extends React.Component {

	constructor(props) {
		super(props);
		this.state = {component: 'schedule',
	role: ""};
		this.getFilms = this.getFilms.bind(this);
		this.getTickets = this.getTickets.bind(this);
		this.getSchedule = this.getSchedule.bind(this);
	}

	getFilms() {
		this.setState({component: 'films'});
	}

	getTickets() {
		this.setState({component: 'tickets'});
	}

	getSchedule() {
		this.setState({component: 'schedule'});
	}

	render() {
		if(this.state.component === 'films') {
			return (
				<div>
					<button className="disabled" style={{verticalAlign:"middle"}} onClick={this.getFilms} disabled><span>Фильмы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getTickets}><span>Билеты</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getSchedule}><span>Расписание</span></button>
					<FilmPage />
				</div>
			);
		} else if(this.state.component === 'tickets') {
			return (
				<div>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilms}><span>Фильмы</span></button>
					<button className="disabled" style={{verticalAlign:"middle"}} onClick={this.getTickets} disabled><span>Билеты</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getSchedule}><span>Расписание</span></button>
					<TicketPage />
				</div>
			);
		} else if(this.state.component === 'schedule') {
			return (
				<div>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getFilms}><span>Фильмы</span></button>
					<button className="button" style={{verticalAlign:"middle"}} onClick={this.getTickets}><span>Билеты</span></button>
					<button className="disabled" style={{verticalAlign:"middle"}} onClick={this.getSchedule} disabled><span>Расписание</span></button>
					<SchedulePage />
				</div>
			);
		}
	} 
}