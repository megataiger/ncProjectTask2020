'use strict';

const React = require('react');
const client = require('./client');

export class FilmPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {films: []};
	}

	componentDidMount() {
		client({method: 'GET', path: './api/films'}).done(response => {
			this.setState({films: response.entity._embedded.films});
		});
	}

	render() {
		return (
			<div>
			<FilmList films={this.state.films}/>
			</div>
		)
	}
}

class FilmList extends React.Component{
	render() {
		const films = this.props.films.map(film =>
			<Film key={film._links.self.href} film={film}/>
		);
		return (
			<table className="pageTable">
				<thead>
					<tr>
						<th>Название фильма</th>
						<th>Описание</th>
						<th>Режиссёр</th>
                        <th>Главные актёры</th>
                        <th>Продолжительность</th>
                        <th>Жанр</th>
                        <th>Возрастное ограничение</th>
					</tr>
				</thead>
				<tbody>
					{films}
				</tbody>
			</table>
		)
	}
}

class Film extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.film.name}</td>
				<td>{this.props.film.description}</td>
				<td>{this.props.film.authors}</td>
                <td>{this.props.film.mainActors}</td>
                <td>{this.props.film.duration}</td>
                <td>{this.props.film.category}</td>
                <td>{this.props.film.ageRating}</td>
			</tr>
		)
	}
}
