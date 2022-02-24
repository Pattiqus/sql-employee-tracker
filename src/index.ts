import Connection from "mysql2/typings/mysql/lib/Connection";
import { updateSourceFile } from "typescript";

// # Import: Node Modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// # Secure: Sensitive data
require("dotenv").config();

// # Connect: To SQL database using .env file
const accessDb = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log('Connected to the employeeRegistrar!')
);

/**
 * Function: initMainMenu
 * Description: Main application menu
 */

const initMainMenu = () => {
    // # Inquirer: Uses Inquirer to add choices to the users terminal
    inquirer.prompt([
        {
            type: "list",
            name: "mainMenu",
            message: "Please choose from the following options",
            choices: ["View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Update an employee's manager",
                    "View employees by manager",
                    "View employees by department",
                    "Delete a role",
                    "Delete a department",
                    "Delete am employee",
                    "View total utilized budget of a department",
                    "Exit application"],
        },
    ])
    // # Switch Statement: calls appropriate function based on user choice
    .then((data) => {
        switch (data.choice) {
            case "View all departments":
                viewDepartments()
                break
            case "View all roles":
                viewRoles()
                break
            case "View all employees":
                viewEmployees()
                break
            case "Add a department":
                addDepartment()
                break
            case "Add a role":
                addRole()
                break
            case "Add an employee":
                addEmployee()
                break
            case "Update an employee role":
                updateEmployeeRole()
                break
            case "Update an employee's manager":
                updateEmployeeManager()
                break
            case "View employees by manager":
                viewEmployeesByManager()
                break
            case "View employees by department":
                viewEmployeesByDepartment()
                break
            case "Delete a role":
                deleteRole()
                break
            case "Delete a department":
                deleteDepartment()
                break
            case "Delete am employee":
                deleteEmployee()
                break
            case "View total utilized budget of a department":
                viewDeptBudget()
                break
            case "Exit application":
                return accessDb.end()
        };
    });
};

// # Display : departments
const viewDepartments = () => {
    // # Query: SQL database for departments
    let sqlPush = `SELECT department.id AS ID,
    department.name AS Deparment
    FROM department;`;

    // # Retreive: retreive data from SQL database
    accessDb.query(sqlPush, (err, data) => {
        if (err) throw err;
        console.table(data);
        // # Return: to main menu
        
        initMainMenu();

    });
};

// # Display : roles
const viewRoles = () => {

    // # Query: SQL database for departments
    let sqlPush = `SELECT role.id AS ID,
    role.title AS Title
    FROM role;`;

    // # Retreive: retreive data from SQL database
    accessDb.query(sqlPush, (err, data) => {
        if (err) throw err;
        console.table(data);

        // # Return: to main menu 
        initMainMenu();

    });
};

// # Display : roles
const viewEmployees = () => {

    // # Query: SQL database for departments
    let sqlPush = `SELECT employee.id AS ID,
    CONCAT (employee.first_name, " ",employee.last_name) AS fullName,
    role.title AS Title,
    department.name AS Department,
    role.salary AS Salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS Manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager.id = manager.id;`;

    // # Retreive: retreive data from SQL database
    accessDb.query(sqlPush, (err, data) => {
        if (err) throw err;
        console.table(data);

        // # Return: to main menu
        initMainMenu();

    });
};

/**
 * Function: addDepartment
 * Description: prompts user with inquirer again with additional questions to add a department
 */
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter name of new department",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log("Enter department name");
                    return false;
                }
            }
        }
    ]).then((data) => {
        let departmentName = data.name;
        let sqlPush = `INSERT INTO department (name) VALUES (?);`;

        accessDb.query(sqlPush, departmentName, (err, data) => {
            if (err) throw err;
            console.log('Department succesfully added');
            viewDepartments();
        });
    });
};

/**
 * Function: addRole
 * Description: prompts user with inquirer again with additional questions to add a new employee to the database
 */
const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Please enter the title of the new role",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log("Please enter the title of the new role");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "Please enter the salary of the new role",
            validate: input => {
                if (input) {
                    if (isNaN(input)) {
                        console.log("Please enter a numerical value");
                        return false
                    }
                    return true
                } else {
                    console.log("Please enter the salary of the new role")
                    return false
                }
            }
        }
    ]).then((data) => {
        // # Declare: details requred to be added to SQL
        let roleDetails = [data.title, data.salary, data.department_id];
        // # Get: current departments from database
        let depSelectSql = `SELECT name, id FROM department;`;

        accessDb.query(depSelectSql, (err, data) => {
            if (err) throw err;
            // # Read: data from SQL to give choices to user on what department the new role should sit in
            let currentDepartments = data.map(({ name, id, }) => ({ name: name, value: id}));

            inquirer.prompt([
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does this role belong to?",
                    choices: currentDepartments
                }
            ]).then((data) => {
                let departmentId = data.department_id;
                roleDetails.push(departmentId);
                let sqlPush = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`;

                accessDb.query(sqlPush, roleDetails, (err, rows) => {
                    if (err) throw err;
                    console.log("Role succesfully added");
                    viewRoles();
                });
            });

        });
    });
};

/**
 * Function: addEmployee
 * Description: propmts user with inquirer to gather data and add new employee to database
 */
const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Please enter the first name of new employee",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log("Please enter the first name of the new employee");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "last_name",
            message: "Please enter the last name of the new employee ",
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log("Please enter the last name of the new employee");
                    return false;
                }
            }
        },
    ]).then((data) => {
        let newEmployeeData = [data.first_name, data.last_name];
        let roleSelectSql = `SELECT * FROM role;`;

        accessDb.query(roleSelectSql, (err, data) => {
            if (err) throw err;
            let currentRoles = data.map(({ title, id }) => ({ name: title, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "role_id",
                    message: "Please enter the new employee's role",
                    choices: currentRoles
                }
            ]).then((data) => {
                let role = data.role_id;
                newEmployeeData.push(role);

                let managerSelectSql = `SELECT e.manager_id, CONCAT(m.first_name, ' ',m.last_name)
                AS manager
                FROM employee e
                LEFT JOIN role r
                ON e.role_id - r.id
                LEFT JOIN employee m
                ON m.id = e.manager_id GROUP BY e.manager_id;`;

                accessDb.query(managerSelectSql, (err, data) => {
                    if (err) throw err;
                    let manager = data.map(({ manager, manager_id}) => ({
                        name: manager,
                        value: manager_id,
                    }));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager_id",
                            message: "Who does the employee report to?",
                            choices: manager
                        }
                    ]).then((data) => {
                        let managerId = data.manager_id
                        newEmployeeData.push(managerId);

                        let sqlPush = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;

                        accessDb.query(sqlPush, newEmployeeData, (err, data) => {
                            if (err) throw err;
                            console.log(`Employee successfully added to database`);
                            viewEmployees();
                        });
                    });
                });
            });
        });
    });
};

/**
 * Function: updateEmployeeRole
 * Description: Updates the role of an employee currently in the database
 */
const updateEmployeeRole = () => {
    let currentEmployeesSql = `SELECT * FROM employee;`;

    accessDb.query(currentEmployeesSql, (err, data) => {
        if (err) throw err;
        let currrentEmployees = data.map(({ id, first_name, last_name}) => ({
            name: first_name + " " + last_name,
            value: id,
        }));
        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Which employee would you like to update?",
                choices: currrentEmployees
            }
        ]).then((data) => {
            let employeeToUpdate = data.name;
            let employeeDetails = [];
            employeeDetails.push(employeeToUpdate);
            let currentRoleSql = `SELECT * FROM role;`;

            accessDb.query(currentRoleSql, (err, data) => {
                if (err) throw err;
                let currentRoles = data.map(({ title, id}) => ({ name: title, value: id}));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "Which role is the Employee now undertaking?",
                        choices: currentRoles
                    }
                ]).then((data) => {
                    let updatedRole = data.role;
                    // # Update: Employee details with updated role
                    employeeDetails.unshift(updatedRole);

                    let sqlPush = `UPDATE employee SET role_id = ? WHERE id = ?;`;

                    accessDb.query(sqlPush, employeeDetails, (err, data) => {
                        if (err) throw err;
                        console.log("Employee updated")
                        viewEmployees();
                    });
                });
            });
        });
    });
};

/**
 * Function: updateEmployeeManager
 * Description: updates an employees manager
 */
const updateEmployeeManager = () => {
    let currentEmployeesSql = `SELECT * FROM employee;`;

    accessDb.query(currentEmployeesSql, (err, data) => {
        if (err) throw err;
        let currrentEmployees = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
        }));
        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Which employee would you like to update?",
                choices: currrentEmployees
            }
        ]).then(data => {
            let employeeToUpdate = data.name;
            let employeeDetails = [];
            employeeDetails.push(employeeToUpdate);
            let currentManagersSql = `SELECT * FROM employee;`;

            accessDb.query(currentManagersSql, (err, data) => {
                if (err) throw err;
                let eligableManagers = data.map(({ id, first_name, last_name}) => ({
                    name: first_name + " " + last_name,
                    value: id,
                }));

            })
        })
    })
}