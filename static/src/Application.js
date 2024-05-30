import {User} from "/src/User.js";


export class Application {
    //Properties
    user;


    constructor() {
        const userData = localStorage.getItem("user");
        if (userData) {
            this.user = new User(JSON.parse(userData).email);
        } else {
            this.user = null;
        }


        document.addEventListener("DOMContentLoaded", () => {
            this.updateDOM();
            this.initEvents();
        });
    }


    initEvents() {
        // Login dialog
        const loginDialog = document.querySelector("#login-dialog");
        document.querySelector(".login").addEventListener("click", () => {
            loginDialog.showModal();
        });
        loginDialog.querySelector(".closeDialog").addEventListener("click", (e) => {
            loginDialog.close();
            e.preventDefault();
        });
        loginDialog.querySelector("form").addEventListener("submit", () => {
            this.login( loginDialog.querySelector("input#login-username").value,
                        loginDialog.querySelector("input#login-password").value);
        });

        // Logout
        document.querySelector(".logout").addEventListener("click", (e) => {
            this.logout();
        });

        //Register
        const registerDialog = document.querySelector("#register-dialog");
        document.querySelector(".register").addEventListener("click", (e) => {
            registerDialog.showModal();
        });
        registerDialog.querySelector(".closeDialog").addEventListener("click", (e) => {
            registerDialog.close();
            e.preventDefault();
        });
        registerDialog.querySelector("form").addEventListener("submit", () => {
            this.register(  registerDialog.querySelector("input#register-username").value,
                            registerDialog.querySelector("input#register-email").value, 
                            registerDialog.querySelector("input#register-password").value);
        });
        
    }

    async login(username, password) {
        const response = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: { username, password }
            }),
        });

        if (response.status === 401) {
            alert("Wrong username or password!");
            return;
        }



        if (response.status !== 200) {
            alert("Error logging in");
            return;
        }

        const { user } = await response.json();
        const { email } = user;
        console.log("Login response:");
        console.log(user);

        this.user = new User(username, email);
        localStorage.setItem("user", JSON.stringify({email: email}));
        this.updateDOM();
    }

    async register(username, email, password) {

        const response = await fetch("/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                register: { username, email, password }
            }),
        });

        if (response.status !== 200) {
            alert("Error registering user");
            return;
        }

        this.user = new User(username, email);
        localStorage.setItem("user", JSON.stringify({username: username, email: email}));
        this.updateDOM();
    }

    async logout() {
        const response = await fetch("/user/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        // if (response.status !== 200) {
        //     alert("Error logging out");
        //     return;
        // }

        this.user = null;
        localStorage.removeItem("user");
        this.updateDOM();
    }


    updateDOM () {
        if (!this.user) {   
            document.querySelector(".logout").classList.add("hiden");
            document.querySelector(".profile").classList.add("hiden");
            document.querySelector(".register").classList.remove("hiden");
            document.querySelector(".login").classList.remove("hiden");
        } else {
            document.querySelector(".logout").classList.remove("hiden");
            document.querySelector(".profile").classList.remove("hiden");
            document.querySelector(".register").classList.add("hiden");
            document.querySelector(".login").classList.add("hiden");
        }
        document.querySelector("header#main-header > nav").classList.remove("opacity-0");
    }

}