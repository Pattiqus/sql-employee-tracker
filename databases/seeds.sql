INSERT INTO department (name)
VALUES  ("Marketing"),
        ("ISD"),
        ("Finance"),
        ("Engineering"),
        ("Logistics");

INSERT INTO role (title, salary, department_id)
VALUES  ("Marketing Coordinator", 75000, 1),
        ("Brand Manager", 80000, 1),
        ("Analytics Specilist", 70000, 2),
        ("Full Stack Developer", 130000, 2),
        ("Accountant", 80000, 3),
        ("Senior Account manager", 100000, 3),
        ("Safety Engineer", 90000, 4),
        ("Design Engineer", 90000, 4),
        ("Supply Chain Coordinator", 60000, 5),
        ("Warehouse Manager", 90000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Bob", "theBuilder", 1, 2),
        ("Dylan", "Bob", 2, NULL),
        ("Adam", "Smith", 3, NULL),
        ("Philip", "Cho", 4, 7),
        ("William", "Windsor", 5, 6),
        ("Vald", "Chuck", 6, NULL),
        ("Harry", "Potter", 7, NULL),
        ("Frodo", "Baggins", 8, NULL),
        ("Gandalf", "thePurple", 9, 10),
        ("Herp", "Derp", 10, NULL);


