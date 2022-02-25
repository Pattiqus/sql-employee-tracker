"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// # Import: Node Modules
var inquirer = require("inquirer");
var mysql = require("mysql2");
var consoleTable = require("console.table");
// # Secure: Sensitive data
require("dotenv").config();
// # Connect: To SQL database using .env file
var accessDb = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}, console.log('Connected to the employeeRegistrar!'));
/**
 * Function: initMainMenu
 * Description: Main application menu
 */
var initMainMenu = function () {
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
        .then(function (data) {
        switch (data.choice) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Update an employee's manager":
                updateEmployeeManager();
                break;
            case "View employees by manager":
                viewEmployeesByManager();
                break;
            case "View employees by department":
                viewEmployeesByDepartment();
                break;
            case "Delete a role":
                deleteRole();
                break;
            case "Delete a department":
                deleteDepartment();
                break;
            case "Delete am employee":
                deleteEmployee();
                break;
            case "View total utilized budget of a department":
                viewDeptBudget();
                break;
            case "Exit application":
                return accessDb.end();
        }
        ;
    });
};
// # Display : departments
var viewDepartments = function () {
    // # Query: SQL database for departments
    var sqlPush = "SELECT department.id AS ID,\n    department.name AS Deparment\n    FROM department;";
    // # Retreive: retreive data from SQL database
    accessDb.query(sqlPush, function (err, data) {
        if (err)
            throw err;
        console.table(data);
        // # Return: to main menu
        initMainMenu();
    });
};
// # Display : roles
var viewRoles = function () {
    // # Query: SQL database for departments
    var sqlPush = "SELECT role.id AS ID,\n    role.title AS Title\n    FROM role;";
    // # Retreive: retreive data from SQL database
    accessDb.query(sqlPush, function (err, data) {
        if (err)
            throw err;
        console.table(data);
        // # Return: to main menu 
        initMainMenu();
    });
};
// # Display : roles
var viewEmployees = function () {
    // # Query: SQL database for departments
    var sqlPush = "SELECT employee.id AS ID,\n    CONCAT (employee.first_name, \" \",employee.last_name) AS fullName,\n    role.title AS Title,\n    department.name AS Department,\n    role.salary AS Salary,\n    CONCAT (manager.first_name, \" \", manager.last_name) AS Manager\n    FROM employee\n    LEFT JOIN role ON employee.role_id = role.id\n    LEFT JOIN department ON role.department_id = department.id\n    LEFT JOIN employee manager ON employee.manager.id = manager.id;";
    // # Retreive: retreive data from SQL database
    accessDb.query(sqlPush, function (err, data) {
        if (err)
            throw err;
        console.table(data);
        // # Return: to main menu
        initMainMenu();
    });
};
/**
 * Function: addDepartment
 * Description: prompts user with inquirer again with additional questions to add a department
 */
var addDepartment = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter name of new department",
            validate: function (input) {
                if (input) {
                    return true;
                }
                else {
                    console.log("Enter department name");
                    return false;
                }
            }
        }
    ]).then(function (data) {
        var departmentName = data.name;
        var sqlPush = "INSERT INTO department (name) VALUES (?);";
        accessDb.query(sqlPush, departmentName, function (err, data) {
            if (err)
                throw err;
            console.log('Department succesfully added');
            viewDepartments();
        });
    });
};
/**
 * Function: addRole
 * Description: prompts user with inquirer again with additional questions to add a new employee to the database
 */
var addRole = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Please enter the title of the new role",
            validate: function (input) {
                if (input) {
                    return true;
                }
                else {
                    console.log("Please enter the title of the new role");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "Please enter the salary of the new role",
            validate: function (input) {
                if (input) {
                    if (isNaN(input)) {
                        console.log("Please enter a numerical value");
                        return false;
                    }
                    return true;
                }
                else {
                    console.log("Please enter the salary of the new role");
                    return false;
                }
            }
        }
    ]).then(function (data) {
        // # Declare: details requred to be added to SQL
        var roleDetails = [data.title, data.salary, data.department_id];
        // # Get: current departments from database
        var depSelectSql = "SELECT name, id FROM department;";
        accessDb.query(depSelectSql, function (err, data) {
            if (err)
                throw err;
            // # Read: data from SQL to give choices to user on what department the new role should sit in
            var currentDepartments = data.map(function (_a) {
                var name = _a.name, id = _a.id;
                return ({ name: name, value: id });
            });
            inquirer.prompt([
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does this role belong to?",
                    choices: currentDepartments
                }
            ]).then(function (data) {
                var departmentId = data.department_id;
                roleDetails.push(departmentId);
                var sqlPush = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);";
                accessDb.query(sqlPush, roleDetails, function (err, rows) {
                    if (err)
                        throw err;
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
var addEmployee = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Please enter the first name of new employee",
            validate: function (input) {
                if (input) {
                    return true;
                }
                else {
                    console.log("Please enter the first name of the new employee");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "last_name",
            message: "Please enter the last name of the new employee ",
            validate: function (input) {
                if (input) {
                    return true;
                }
                else {
                    console.log("Please enter the last name of the new employee");
                    return false;
                }
            }
        },
    ]).then(function (data) {
        var newEmployeeData = [data.first_name, data.last_name];
        var roleSelectSql = "SELECT * FROM role;";
        accessDb.query(roleSelectSql, function (err, data) {
            if (err)
                throw err;
            var currentRoles = data.map(function (_a) {
                var title = _a.title, id = _a.id;
                return ({ name: title, value: id });
            });
            inquirer.prompt([
                {
                    type: "list",
                    name: "role_id",
                    message: "Please enter the new employee's role",
                    choices: currentRoles
                }
            ]).then(function (data) {
                var role = data.role_id;
                newEmployeeData.push(role);
                var managerSelectSql = "SELECT e.manager_id, CONCAT(m.first_name, ' ',m.last_name)\n                AS manager\n                FROM employee e\n                LEFT JOIN role r\n                ON e.role_id - r.id\n                LEFT JOIN employee m\n                ON m.id = e.manager_id GROUP BY e.manager_id;";
                accessDb.query(managerSelectSql, function (err, data) {
                    if (err)
                        throw err;
                    var manager = data.map(function (_a) {
                        var manager = _a.manager, manager_id = _a.manager_id;
                        return ({
                            name: manager,
                            value: manager_id,
                        });
                    });
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager_id",
                            message: "Who does the employee report to?",
                            choices: manager
                        }
                    ]).then(function (data) {
                        var managerId = data.manager_id;
                        newEmployeeData.push(managerId);
                        var sqlPush = "INSERT INTO employee (first_name, last_name, role_id, manager_id)\n                        VALUES (?, ?, ?, ?)";
                        accessDb.query(sqlPush, newEmployeeData, function (err, data) {
                            if (err)
                                throw err;
                            console.log("Employee successfully added to database");
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
var updateEmployeeRole = function () {
    var currentEmployeesSql = "SELECT * FROM employee;";
    accessDb.query(currentEmployeesSql, function (err, data) {
        if (err)
            throw err;
        var currrentEmployees = data.map(function (_a) {
            var id = _a.id, first_name = _a.first_name, last_name = _a.last_name;
            return ({
                name: first_name + " " + last_name,
                value: id,
            });
        });
        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Which employee would you like to update?",
                choices: currrentEmployees
            }
        ]).then(function (data) {
            var employeeToUpdate = data.name;
            var employeeDetails = [];
            employeeDetails.push(employeeToUpdate);
            var currentRoleSql = "SELECT * FROM role;";
            accessDb.query(currentRoleSql, function (err, data) {
                if (err)
                    throw err;
                var currentRoles = data.map(function (_a) {
                    var title = _a.title, id = _a.id;
                    return ({ name: title, value: id });
                });
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "Which role is the Employee now undertaking?",
                        choices: currentRoles
                    }
                ]).then(function (data) {
                    var updatedRole = data.role;
                    // # Update: Employee details with updated role
                    employeeDetails.unshift(updatedRole);
                    var sqlPush = "UPDATE employee SET role_id = ? WHERE id = ?;";
                    accessDb.query(sqlPush, employeeDetails, function (err, data) {
                        if (err)
                            throw err;
                        console.log("Employee updated");
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
var updateEmployeeManager = function () {
    var currentEmployeesSql = "SELECT * FROM employee;";
    accessDb.query(currentEmployeesSql, function (err, data) {
        if (err)
            throw err;
        var currrentEmployees = data.map(function (_a) {
            var id = _a.id, first_name = _a.first_name, last_name = _a.last_name;
            return ({
                name: first_name + " " + last_name,
                value: id,
            });
        });
        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Which employee would you like to update?",
                choices: currrentEmployees
            }
        ]).then(function (data) {
            var employeeToUpdate = data.name;
            var employeeDetails = [];
            employeeDetails.push(employeeToUpdate);
            var currentManagersSql = "SELECT * FROM employee;";
            accessDb.query(currentManagersSql, function (err, data) {
                if (err)
                    throw err;
                var eligableManagers = data.map(function (_a) {
                    var id = _a.id, first_name = _a.first_name, last_name = _a.last_name;
                    return ({
                        name: first_name + " " + last_name,
                        value: id,
                    });
                });
                inquirer.prompt([
                    {
                        type: "list",
                        name: "newManager",
                        message: "Who does the employee now report to?",
                        choices: eligableManagers
                    }
                ]).then(function (data) {
                    var newManager = data.newManager;
                    employeeDetails.push(newManager);
                    var updatedEmployee = employeeDetails[0];
                    employeeDetails[0] = newManager;
                    employeeDetails[1] = updatedEmployee;
                    var sqlPush = "UPDATE employee SET manager_id = ? WHERE id = ?";
                    accessDb.query(sqlPush, employeeDetails, function (err, data) {
                        if (err)
                            throw err;
                        console.log("Employee profile has been succesfully updated");
                        viewEmployees;
                    });
                });
            });
        });
    });
};
/**
 * Function: viewEmployeesByManager
 * Description: View all employees based on which manager they report to
 */
var viewEmployeesByManager = function () {
    var currentManagersSql = "SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) \n    AS manager FROM employee e LEFT JOIN role r\n    ON e.role_id = r.id\n    LEFT JOIN department d\n    ON d.id = r.department_id\n    LEFT JOIN employee m\n    ON m.id = e.manager_id GROUP BY e.manager_id;";
    accessDb.query(currentManagersSql, function (err, data) {
        if (err)
            throw err;
        var currentManagers = data.map(function (_a) {
            var manager_id = _a.manager_id, manager = _a.manager;
            return ({
                value: manager_id,
                name: manager,
            });
        });
        inquirer.prompt([
            {
                type: "list",
                name: "managers",
                Message: "Which managers team would you like to view?",
                choices: currentManagers
            }
        ]).then(function (data) {
            var managerTeams = [data.managers];
            var sqlGet = "SELECT e.id, e.first_name, e.last_name, r.title,\n            CONCAT(m.first_name, ' ', m.last_name) AS manager\n            FROM employee e\n            JOIN role r\n            ON e.role_id = r.id\n            JOIN department_id\n            ON m.id = e.manager_id\n            WHERE m.id = ?;";
            accessDb.query(sqlGet, managerTeams, function (err, data) {
                if (err)
                    throw err;
                console.table(data);
                initMainMenu();
            });
        });
    });
};
/**
 * Function: viewEmployeeByDepartment
 * Description: View employees based on which department they are working in
 */
var viewEmployeesByDepartment = function () {
    var employeeByDeptSql = "SELECT CONCAT(first_name, \" \", last_name) AS name,\n    department.name AS Department\n    FROM employee\n    LEFT JOIN role ON employee.role_id = role.id\n    LEFT JOIN department ON role.department_id = department.id;";
    accessDb.query(employeeByDeptSql, function (err, data) {
        if (err)
            throw err;
        console.table(data);
        initMainMenu();
    });
};
/**
 * Function: deleteDepartment
 * Description: Delete a department from the database
 */
var deleteDepartment = function () {
    var departmentSqlGet = "SELECT * FROM department;";
    accessDb.query(departmentSqlGet, function (err, data) {
        if (err)
            throw err;
        var currentDepartments = data.map(function (_a) {
            var name = _a.name, id = _a.id;
            return ({ name: name, value: id });
        });
        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Which department do you want to remove",
                choices: currentDepartments
            }
        ]).then(function (data) {
            var department = data.department;
            var sqlRemove = "DELETE FROM department WHERE id = ?;";
            accessDb.query(sqlRemove, department, function (err, data) {
                if (err)
                    throw err;
                console.log("Department succesfully removed");
                viewDepartments();
            });
        });
    });
};
/**
 * Function: deleteRole
 * Description: Delete a role from the database
 */
var deleteRole = function () {
    var roleSqlGet = "SELECT * FROM role;";
    accessDb.query(roleSqlGet, function (err, data) {
        if (err)
            throw err;
        var currentRoles = data.map(function (_a) {
            var name = _a.name, id = _a.id;
            return ({ name: name, value: id });
        });
        inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Which role do you want to remove",
                choices: currentRoles
            }
        ]).then(function (data) {
            var role = data.role;
            var sqlRemove = "DELETE FROM role WHERE id = ?;";
            accessDb.query(sqlRemove, role, function (err, data) {
                if (err)
                    throw err;
                console.log("Role succesfully removed");
                viewRoles();
            });
        });
    });
};
/**
 * Function: deleteRole
 * Description: Delete a role from the database
 */
var deleteEmployee = function () {
    var employeeSqlGet = "SELECT * FROM employee;";
    accessDb.query(employeeSqlGet, function (err, data) {
        if (err)
            throw err;
        var currentEmployees = data.map(function (_a) {
            var name = _a.name, id = _a.id;
            return ({ name: name, value: id });
        });
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee do you want to remove",
                choices: currentEmployees
            }
        ]).then(function (data) {
            var employee = data.employee;
            var sqlRemove = "DELETE FROM employee WHERE id = ?;";
            accessDb.query(sqlRemove, employee, function (err, data) {
                if (err)
                    throw err;
                console.log("Employee succesfully removed");
                viewEmployees();
            });
        });
    });
};
/**
 * Function: viewDeptBudget
 * Description: view the sum of the salaries of all employees within a department
 */
var viewDeptBudget = function () {
    var sqlBudgetGet = "SELECT department_id AS ID,\n    department.name AS department,\n    SUM(salary) AS Budget\n    FROM role\n    JOIN department ON role.department_id = department.id GROUP BY department_id;";
    accessDb.query(sqlBudgetGet, function (err, data) {
        if (err)
            throw err;
        console.table(data);
        initMainMenu();
    });
};
initMainMenu();
