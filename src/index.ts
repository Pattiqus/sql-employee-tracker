import Connection from "mysql2/typings/mysql/lib/Connection";
import { updateSourceFile } from "typescript";

// # Import: Node Modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// # Secure: Sensitive data
require("dotenv").config();

// # Connect: To SQL database using .env file
const login = mysql.createConnection(
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
                updateRole()
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
                return login.end()
            
        };
    });
};

// # Display : departments
const viewDepartments = () => {
    // # Query: SQL database for departments
    let sql = `SELECT department.id AS ID,
    department.name AS Deparment
    FROM department;`;

    // # Retreive: retreive data from SQL database
    login.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);
        // # Return: to main menu
        
        initMainMenu();

    });
};

// # Display : roles
const viewRoles = () => {

    // # Query: SQL database for departments
    let sql = `SELECT role.id AS ID,
    role.title AS Title
    FROM role;`;

    // # Retreive: retreive data from SQL database
    login.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);

        // # Return: to main menu 
        initMainMenu();

    });
};

// # Display : roles
const viewEmployees = () => {

    // # Query: SQL database for departments
    let sql = `SELECT employee.id AS ID,
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
    login.query(sql, (err, data) => {
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
        let sql = `INSERT INTO department (name) VALUES (?);`;

        login.query(sql, departmentName, (err, data) => {
            if (err) throw err;
            console.log('Department succesfully added');
            viewDepartments();
        });
    });
};