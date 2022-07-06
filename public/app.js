// const URL = "https://forum2022.codeschool.cloud";
const URL = "http://localhost:8080"

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
        newPostBody: "",

        errorMessage: "",

        allThreads: [],
        currentThread: "",  

        createThreadName: "",
        createThreadDescription: "",
        createThreadCategory: "",

        commenting: false,
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
                this.getThreads();
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
                this.getThreads();
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
            let response = await fetch(`${URL}/users`, {
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
        },
        // GET /threads - Get all threads
        getThreads: async function () {
            let response = await fetch(`${URL}/thread`, {
                method: "GET",
                credentials: "include"
            });

            // Parse response body
            let body = await response.json();
            console.log(body);

            // Check if threads were retrieved
            if (response.status == 200) {
                console.log("Successful thread retrieval");
                this.currentPage = "home-page";
                this.allThreads = body;
            } else {
                console.log("error GETTING /thread", response.status, response);
            }
        },
        // POST /threads - Create new thread
        postThread: async function () {
            let newThread = {
                name: this.createThreadName,
                description: this.createThreadDescription,
                category: this.createThreadCategory
            }
            let response = await fetch(`${URL}/thread`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newThread)
            }); 

            // Parse response body
            let body = await response.json();
            console.log(body);

            // Check if thread was created
            if (response.status == 201) {
                console.log("Successful thread creation");

                // Take user to new page and clear inputs
                this.currentPage = "home-page";
                this.getThreads();
                this.createThreadName = "";
                this.createThreadDescription = "";
                this.createThreadCategory = "";

            } else if (response.status == 400) {
                console.log("Unsuccessful thread creation");
                this.errorMessage = "Unsuccessful thread creation"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);

                // Let user know thread creation failed and clear inputs
                this.createThreadName = "";
                this.createThreadDescription = "";
                this.createThreadCategory = "";
            } else {
                console.log("error POSTING /threads", response.status, response);
                this.errorMessage = "Ensure all fields are filled out"
                setInterval(() => {
                    this.errorMessage = "";
                }, 5000);
            }
        },
        loadThreadPage: function () {
            this.postBody = "";
            this.currentPage = 'thread';
        },
        getSingleThread: async function (id) {
            let response = await fetch(URL + "/thread/" + id, {
                credentials: "include"
            });

            // check response status
            if (response.status == 200) {
                this.currentThread = await response.json();
                this.loadThreadPage();
            } else {
                console.error("Error fetching individual request with id", id, "- status:", response.status);
            }
        },
        // DELETE /threads - Delete thread object
        deleteThread: async function (thread) {
            let response = await fetch(URL + "/thread/" + thread._id, {
                method: "DELETE",
                credentials: "include"
            });

            // check response status
            if (response.status == 200) {
                this.getThreads();
            } else {
                console.error("Error deleting thread with id", id, "- status:", response.status);
            }
        },
        // POST /post - posts a comment to a thread
        postPost: async function (id) {
            let postBody = {
                body: this.newPostBody,
                thread_id: id
            }

            let response = await fetch(URL + "/post", {
                method: "POST",
                body: JSON.stringify(postBody),
                headers: {
                    "Content-Type" : "application/json"
                },
                credentials: "include"
            });

            if (response.status == 201) {
                // created successfully
                this.getSingleThread(id);
            } else {
                console.log("Error posting new post:", response.status);
            }
        },
    },
    created: function () {
        this.getSession();
    }
});