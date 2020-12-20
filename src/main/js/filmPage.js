'use strict';

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
const client = require('./client'); // <3>
// end::vars[]

// tag::film-page[]
export class FilmPage extends React.Component { // <1>

	constructor(props) {
		super(props);
		this.state = {films: []};
	}

	componentDidMount() { // <2>
		client({method: 'GET', path: './api/films'}).done(response => {
			this.setState({films: response.entity._embedded.films});
		});
	}

	render() { // <3>
		return (
			<div>
			<FilmList films={this.state.films}/>
			</div>
		)
	}
}
// end::film-page[]

// tag::film-list[]
class FilmList extends React.Component{
	render() {
		const films = this.props.films.map(film =>
			<Film key={film._links.self.href} film={film}/>
		);
		return (
			<table className="pageTable">
				<tbody>
					<tr>
						<th>Название фильма</th>
						<th>Описание</th>
						<th>Режиссёр</th>
                        <th>Главные актёры</th>
                        <th>Продолжительность</th>
                        <th>Жанр</th>
                        <th>Возрастное ограничение</th>
					</tr>
					{films}
				</tbody>
			</table>
		)
	}
}
// end::film-list[]

// tag::film[]
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
// end::film[]