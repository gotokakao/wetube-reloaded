export const localsMiddleware = (req, res, next) =>{
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.leggedInUser = req.session.user || {};
    res.locals.siteName = "Wetube";
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/");
    }
}