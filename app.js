const URL = "https://forum2022.codeschool.cloud";

var app = new Vue({
    el: '#app',
    data: {
        currentPage: "login-page",

        // Login form inputs
        loginEmailInput: "",
        loginPasswordInput: "",

        // Signup form inputs
        newEmailInput: "",
        newPasswordInput: "",
        newFullNameInput: "",

        errorMessage: "",
    },
    methods: {
        // GET /session - Ask server if we are logged in
        getSession: async function () {
            let response = await fetch(`${URL}/session`, {
                method: "GET",
                credentials: "include"
            });

            // Check if logged in
            if (response.status == 200) {
                // logged in
                console.log("logged in");
                let data = await response.json();
                console.log(data);
                this.currentPage = "home-page"
            } else if (response.status == 401) {
                // not logged in
                console.log("not logged in");
                let data = await response.json();
                console.log(data);
            } else {
                console.log("error GETTING /session", response.status, response);
            }
        },
        // POST /session - Attempt to login
        postSession: async function () {
            let loginCredentials = {username: this.loginEmailInput, password: this.loginPasswordInput}
            let response = await fetch(`${URL}/session`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginCredentials)
            }); 

            // Parse response body
            let body = response.json();
            console.log(body);

            // Check if login was successful
            if (response.status == 201) {
                console.log("Successful login attempt");

                // Take user to new page and clear inputs
                this.currentPage = "home-page";
                this.loginEmailInput = "";
                this.loginPasswordInput = "";

            } else if (response.status == 401) {
                console.log("Unsuccessful login attempt")
                this.errorMessage = "Unsuccessful login attempt. Check email and password"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);
                // Let user know login failed and clear password input
                this.loginPasswordInput = "";
            } else {
                console.log("error POSTING /session", response.status, response);
                this.errorMessage = "Ensure all fields are filled out and email is valid"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);
            }
        },
        // POST /users - Create new user
        postUser: async function () {
            let newUser = {
                username: this.newEmailInput,
                password: this.newPasswordInput,
                fullname: this.newFullNameInput
            }
            let response = await fetch(`${URL}/user`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            }); 

            // Parse response body
            let body = response.json();
            console.log(body);

            // Check if user was created
            if (response.status == 201) {
                console.log("Successful user creation");

                // Take user to new page and clear inputs
                this.currentPage = "login-page";
                this.newEmailInput = "";
                this.newPasswordInput = "";
                this.newFullNameInput = "";

            } else if (response.status == 400) {
                console.log("Unsuccessful user creation");
                this.errorMessage = "Unsuccessful user creation"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);

                // Let user know user creation failed and clear inputs
                this.newEmailInput = "";
                this.newPasswordInput = "";
                this.newFullNameInput = "";
            } else {
                console.log("error POSTING /users", response.status, response);
                this.errorMessage = "Ensure all fields are filled out and email is valid"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);
            }
        }
    },
    created: function () {
        this.getSession();
    }
});