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
 * Function: Main Menu
 * Description: Main application menu
 */

const init = () => {
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

