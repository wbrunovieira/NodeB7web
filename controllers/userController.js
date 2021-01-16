const User = require('../models/User');
const crypto = require('crypto');

exports.login = (req, res) => {
    res.render('login');
};

exports.loginAction = (req, res) => {
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result)=> {
        if(!result){
            req.flash('error', 'Seu email e/ou senha estao errados');
            res.redirect('/users/login');
            return;
        }

        req.login(result, ()=>{});

        req.flash('success','Voce foi logado com sucesso');
        res.redirect('/');

    });
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

exports.register = (req, res) => {
    res.render('register');
};

exports.registerAction = (req, res) => {
    const newUser = new User(req.body)
    User.register(newUser, req.body.password, (error)=> {
        if(error){
            req.flash('error','Ocorreu um erro tente mais tarde');
            res.redirect('/users/register');
            return;
        }
        req.flash('success','Registro efetuado com sucesso. Faca o login.');
        res.redirect('/');
    });

}

exports.profile = (req, res) => {
    res.render('profile');
}

exports.profileAction = async (req, res) => {
    try {

    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { name: req.body.name, email: req.body.email },
        { new: true, runValidators:true }
    );
    }catch(e){
        req.flash('error', 'Ocorreu um erro'+e.message);
        res.redirect('/profile');
        return;

    }
    req.flash('success', 'Dados atualizados com sucesso');
    res.redirect('/profile');
};

exports.forget = (req, res) => {
     res.render('forget');
}

exports.forgetAction = async (req, res) => {
    const user = await User.findOne({email:req.body.email}).exec();

    if(!user){
        req.flash('error', 'email nao cadastrado');
        res.redirect('/users/forget');
        return;
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; //1 hora
    await user.save();

    const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;

    req.flash('success', 'Enviamos um email com Instrucoes'+resetLink);
    res.redirect('/users/login');

};

exports.forgetToken = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    }).exec();

    if(!user) {
        req.flash('error', 'Token Expirado');
        res.redirect('/users/forget');
        return;
    }

    res.render('forgetPassword');
};

exports.forgetTokenAction = async (req, res) => {

    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    }).exec();

    if(!user) {
        req.flash('error', 'Token Expirado');
        res.redirect('/users/forget');
        return;
    }

    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'Senhas nao batem');
        res.redirect('back');
        return;
    }

    user.setPassword(req.body.password, async ()=> {
        await user.save();

        req.flash('success','Senha alterada com sucesso');
        res.redirect('/');
    });



}