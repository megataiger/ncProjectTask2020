'use strict';

const React = require('react');
const client = require('./client');

export class FilmSessionPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {filmSessions: []};
	}

	componentDidMount() {
		client({method: 'GET', path: './api/filmSessions'}).done(response => {
			this.setState({filmSessions: response.entity._embedded.filmSessions});
		});
	}

	render() {
		return (
			<div>
			<FilmSessionList filmSessions={this.state.filmSessions}/>
			</div>
		)
	}
}

class FilmSessionList extends React.Component{
	render() {
		const filmSessions = this.props.filmSessions.map(filmSession =>
			<FilmSession key={filmSession._links.self.href} filmSession={filmSession}/>
		);
		return (
			<table className="pageTable">
				<thead>
					<tr>
						<th>Название фильма</th>
						<th>Начало сеанса</th>
						<th>Цена на билет</th>
                        <th>Зал</th>
					</tr>
				</thead>
				<tbody>
					{filmSessions}
				</tbody>
			</table>
		)
	}
}

class FilmSession extends React.Component{
    
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
				<td>{this.props.filmSession.room}</td>
			</tr>
		)
	}
}
