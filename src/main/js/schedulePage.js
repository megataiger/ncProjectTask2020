'use strict';

const React = require('react');
const client = require('./client');

export class SchedulePage extends React.Component {

	render() {
		return (
			<div>
			<CalendarDayList/>
			</div>
		)
	}
}

class CalendarDayList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {calendarDays: []}
    }

    componentDidMount() {
        client({method: 'GET', path: './api/calendarDays'}).done(response => {
			this.setState({calendarDays: response.entity._embedded.calendarDays});
		});
    }

    render() {
        const calendarDays = this.state.calendarDays.map(calendarDay =>
            <CalendarDay key={calendarDay._links.self.href} calendarDay={calendarDay}/>
        );
        return (
            <table className="pageTable">
                <thead>
                    <tr>
                        <th>Название фильма</th>
                        <th>Время начала</th>
                        <th>Цена на билет</th>
                    </tr>
                </thead>
                <tbody>
                    {calendarDays}
                </tbody>
            </table>
        );
    }
}

class CalendarDay extends React.Component{
    constructor(props) {
        super(props);
        this.state = {filmSessions: []};
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.calendarDay._links.filmSessionList.href}).done(response => {
			this.setState({filmSessions: response.entity._embedded.filmSessions});
        });
    }

	render() {
        const calendarDayValue = this.props.calendarDay.calendarDay.year + "-" + this.props.calendarDay.calendarDay.month + "-" + this.props.calendarDay.calendarDay.dayOfMonth;
        const date = new Date(calendarDayValue);
        const formatDate = date.toLocaleString('ru-RU', {year: 'numeric', month: '2-digit', day: '2-digit'});
		return (
            <React.Fragment>
                <tr><td colSpan="3" className="date"><b>{formatDate}</b></td></tr>
                <FilmSessionList filmSessionList={this.state.filmSessions}/>
            </React.Fragment>
		);
	}
}

class FilmSessionList extends React.Component {
    render() {
        const filmSessions = this.props.filmSessionList.map(filmSession => 
            <FilmSession key={filmSession._links.self.href} filmSession={filmSession}/>
        );
        if (filmSessions.length == 0) {
            return (
                <tr>
                    <td colSpan="3" align="center">На данную дату не назначено сеансов</td>
                </tr>
            );
        } else {
            return (
                <React.Fragment>
                    {filmSessions}
                </React.Fragment>
            );
        }
    }
}

class FilmSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {film: []};
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.filmSession._links.film.href}).done(response => {
			this.setState({film: response.entity});
		});
    }

    render() {
        return (
            <tr>
                <td>{this.state.film.name}</td>
                <td>{this.props.filmSession.timeBegin}</td>
                <td>{this.props.filmSession.price}&#8381;</td>
            </tr>
        );
    }
}