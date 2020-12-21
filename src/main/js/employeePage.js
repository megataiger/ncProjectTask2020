'use strict';

const React = require('react');
const client = require('./client');

export class EmployeePage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {employees: []};
	}

	componentDidMount() {
		client({method: 'GET', path: './api/employees'}).done(response => {
			this.setState({employees: response.entity._embedded.employees});
		});
	}

	render() {
		return (
			<div>
			<EmployeeList employees={this.state.employees}/>
			</div>
		)
	}
}

class EmployeeList extends React.Component{
	render() {
		const employees = this.props.employees.map(employee =>
			<Employee key={employee._links.self.href} employee={employee}/>
		);
		return (
			<table className="pageTable">
				<thead>
					<tr>
						<th>Имя</th>
						<th>Дата рождения</th>
						<th>Должность</th>
					</tr>
				</thead>
				<tbody>
					{employees}
				</tbody>
			</table>
		)
	}
}

class Employee extends React.Component{
	render() {
		const calendarDayValue = this.props.employee.birthday.year + "-" + this.props.employee.birthday.month + "-" + this.props.employee.birthday.dayOfMonth;
        const date = new Date(calendarDayValue);
        const formatDate = date.toLocaleString('ru-RU', {year: 'numeric', month: '2-digit', day: '2-digit'});
		return (
			<tr>
				<td>{this.props.employee.name}</td>
				<td>{formatDate}</td>
				<td>{this.props.employee.workPosition}</td>
			</tr>
		)
	}
}