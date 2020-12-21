'use strict';

const React = require('react'); // <1>
const client = require('./client'); // <3>

export class TicketPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {tickets: []};
	}

	componentDidMount() {
		client({method: 'GET', path: './api/tickets'}).done(response => {
			this.setState({tickets: response.entity._embedded.tickets});
		});
	}

	render() {
		return (
			<div>
			    <TicketList tickets={this.state.tickets}/>
			</div>
		)
	}
}

class TicketList extends React.Component{
	render() {
		const tickets = this.props.tickets.map(ticket =>
			<Ticket key={ticket._links.self.href} ticket={ticket}/>
		);
		return (
			<table className="pageTable">
				<thead>
					<tr>
						<th>Название фильма</th>
						<th>Начало сеанса</th>
						<th>Цена на билет</th>
                        <th>Зал</th>
                        <th>Ряд</th>
                        <th>Место</th>
                        <th>Дата показа</th>
                        <th>Дата продажи</th>
                        <th>Продал</th>
					</tr>
                </thead>
                <tbody>
					{tickets}
				</tbody>
			</table>
		)
	}
}

class Ticket extends React.Component{
	render() {
        const calendarDayValue = this.props.ticket.timeSale.year + "-" + this.props.ticket.timeSale.month + "-" + this.props.ticket.timeSale.dayOfMonth + 
        " " + this.props.ticket.timeSale.hour + ":" + this.props.ticket.timeSale.minute + ":" + this.props.ticket.timeSale.second;
        const date = new Date(calendarDayValue);
        const formatDate = date.toLocaleString('ru-RU', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});
		return (
			<tr>
                <FilmSession filmSession={this.props.ticket._links.filmSession.href}/>
                <td>{this.props.ticket.rowRoom}</td>
                <td>{this.props.ticket.place}</td>
                <CalendarDay calendarDay={this.props.ticket._links.showDay.href}/>
                <td>{formatDate}</td>
                <Employee employee={this.props.ticket._links.employee.href}/>
			</tr>
		)
	}
}

class FilmSession extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {filmSession: [], film: []};
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.filmSession}).done(response => {
            this.setState({filmSession: response.entity});
            client({method: 'GET', path: response.entity._links.film.href}).done(response => {
                this.setState({film: response.entity});
            });
        });
    }

	render() {
		return (
            <React.Fragment>
                <td>{this.state.film.name}</td>
                <td>{this.state.filmSession.timeBegin}</td>
                <td>{this.state.filmSession.price}&#8381;</td>
                <td>{this.state.filmSession.room}</td>
            </React.Fragment>
		);
	}
}

class CalendarDay extends React.Component{
    constructor(props) {
        super(props);
        this.state = {calendarDay: []}
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.calendarDay}).done(response => {
            this.setState({calendarDay: response.entity.calendarDay});
        });
    }

    render() {
        const calendarDayValue = this.state.calendarDay.year + "-" + this.state.calendarDay.month + "-" + this.state.calendarDay.dayOfMonth;
        const date = new Date(calendarDayValue);
        const formatDate = date.toLocaleString('ru-RU', {year: 'numeric', month: '2-digit', day: '2-digit'});
        return (
            <td>{formatDate}</td>
        );
    }
}

class Employee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {employee: []}
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.employee}).done(response => {
            this.setState({employee: response.entity});
        });
    }

    render() {
        return (
            <td>{this.state.employee.name} {this.state.employee.workPosition}</td>
        );
    }
}