'use strict';

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
const client = require('./client'); // <3>
// end::vars[]

// tag::app[]
export class EmployeePage extends React.Component { // <1>

	constructor(props) {
		super(props);
		this.state = {employees: []};
	}

	componentDidMount() { // <2>
		client({method: 'GET', path: './api/employees'}).done(response => {
			this.setState({employees: response.entity._embedded.employees});
		});
	}

	render() { // <3>
		return (
			<div>
			<EmployeeList employees={this.state.employees}/>
			</div>
		)
	}
}
// end::app[]

// tag::employee-list[]
class EmployeeList extends React.Component{
	render() {
		const employees = this.props.employees.map(employee =>
			<Employee key={employee._links.self.href} employee={employee}/>
		);
		return (
			<table className="pageTable">
				<tbody>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Description</th>
					</tr>
					{employees}
				</tbody>
			</table>
		)
	}
}
// end::employee-list[]

// tag::employee[]
class Employee extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.employee.name}</td>
				<td>{this.props.employee.birthday.dayOfMonth}-{this.props.employee.birthday.month}-{this.props.employee.birthday.year}</td>
				<td>{this.props.employee.workPosition}</td>
			</tr>
		)
	}
}
// end::employee[]
