import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { response } from "express";

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
    const user = await User.findOne({username, socialOnly : false});
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

        
        let user = await User.findOne({email : emailObj.email});
        if(!user){
            user = await User.create({
                name : userData.name,
                avatarUrl : userData.avatar_url,
                email : emailObj.email,
                username : userData.login,
                location : userData.location,
                socialOnly : true,
                password : "",
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/login");
    }else{
        return res.redirect("/login");
    }
}
/**
export const startNaverLogin = (req, res) => {
    const baseUrl = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
    const config = {
        client_id : process.env.NAVER_CLIENT,
        redirect_uri : "http://localhost:4000/users/naver/finish",
        state : "RAMDOM_STATE",
    }

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}&${params}`;
    return res.redirect(finalUrl);
}
export const finishNaverLogin = async (req, res) =>{
    const baseUrl = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code";
    const config = {
        client_id : process.env.NAVER_CLIENT,
        client_secret : process.env.NAVER_SECRET,
        state : req.query.state,
        code : req.query.code,

    };
    
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}&${params}`;
    let accessToken;
    fetch(finalUrl)
    .then((response) => response.json())
    .then((data) => console.log(data));
    return res.end();

}
 */

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle : "Edit Profile"});
}

export const postEdit = async (req, res) => {
    const {
        session : 
            {user : {_id, avatarUrl}}, 
        body : 
            {email, username, name, location},
        file 
    } = req;

    const updatedUser = await User.findByIdAndUpdate(
        _id, 
            {
                avatarUrl : file ? file.path : avatarUrl,
                email,
                username,
                name,
                location,
            },
            {new : true},
        );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
        
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getChangePassword = (req, res) =>{
    return res.render("users/change-password", {pageTitle : "Change Password"});

}

export const postChangePassword = async (req ,res) => {
    const {session : 
        {user : 
            {_id}
        },
        body: {oldPassword, newPassword1, newPassword2},
    } = req;

    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);

    if(!ok){
        return res.status(400).render("users/change-password", {pageTitle : "Change Password", errorMessage : "Current Password is incorrent"});
    }

    if(newPassword1 !== newPassword2){
        return res.status(400).render("users/change-password", {pageTitle : "Change Password", errorMessage : "Please Check New Password"});
    }

    user.password = newPassword1;
    await user.save();
    return res.redirect("/");

}

export const see = (req, res) => res.send("See");