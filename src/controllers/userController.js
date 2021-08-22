import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", {pageTitle : "Join"});
export const postJoin = async (req, res) => {
    const {name, email, username, password,password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join", {pageTitle, errorMessage : "Password confirmation does not match"});
    }
    const exists = await User.exists({$or : [{username}, {email}]});
    if(exists){
        return res.status(400).render("join", {pageTitle, errorMessage : "This username/email is already taken"});
    }

    try{
        await User.create({
            name,
            email,
            username,
            password,
            location,
        });
       return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join",{pageTitle, errorMessage : error._message}); 
    }
};

export const getLogin = (req, res) => res.render("login",{pageTitle : "Login"});

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const pageTitle = "Login";
    if(!username){
        return res.status(400).render("login", {pageTitle, errorMessage : "An account with this username does not exixts"});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).render("login", {pageTitle, errorMessage : "Wrong Password"});
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) =>{
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : "read:user user:email",
    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);

}

export const finishGithubLogin = async (req, res) =>{
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id : process.env.GH_CLIENT,
        client_secret : process.env.GH_SECRET,
        code : req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
            await fetch(finalUrl,{
            method : "POST",
            headers : {
                Accept: "application/json",
            },

        })
    ).json();

    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`,{
            headers : {
                Authorization : `token ${access_token}`,
            },
        })).json();

        const emailData = await (await fetch(`${apiUrl}/user/emails`,{
            headers : {
                Authorization : `token ${access_token}`,
            },
        })).json();

        const emailObj = emailData.find(email => email.primary === true && email.verified === true);

        if(!emailObj){
            return res.redirect("/login");
        }

        
        const existedUser = await User.findOne({email : emailObj.email});

        if(existedUser){
            req.session.loggedIn = true;
            req.session.user = existedUser;
            return res.redirect("/login");
        }else{
            const user = await User.create({
                name : userData.name,
                email : emailObj.email,
                username : userData.login,
                location : userData.location,
                socialOnly : true,
                password : "",
            });
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/login");
        }
    }else{
        return res.redirect("/login");
    }
}

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete Users"); 

export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");