const express = require('express');
const bcrypt = require('bcryptjs'); //для шифрования пароля
const {check,validationResult} = require('express-validator')
const User = require('../models/User')
const tokenService = require('../services/token.service')
const {generateUserData} = require("../utils/helpers");
const chalk = require("chalk");
const router = express.Router({mergeParams: true});

//реализуем методы
//POST signUp
router.post('/signUp', [
    //валидация
    check('email', 'Uncorrect email').isEmail(),
    check('password', "Minimum password's length is 8").isLength({min: 8}),
    
    async (req, res) => {

    //проверка ошибок валидации
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                error: {
                    message: 'INVALID_DATA',
                    code: 400,
                    errors: errors.array()
                }
            })
        }

    //CREATING USER
    try{
        const {email, password} = req.body;
        // console.log(email, password)
        //ищем в коллеции пользователей одного с полем {email: email}
        //если найден -> выдаем ошибку
        const existingUser = await User.findOne({email});
        // console.log(chalk.blue('existingUser: ', existingUser));

        if(existingUser){
            return res.status(400).json({
                error: {
                    message: 'EMAIL_EXISTS',
                    code: 400
                }
            })
        }

        //если не найден -> шифруем пароль
        const hashedPassword = await bcrypt.hash(password,12);
        // console.log(chalk.blue('hashedPassword: ', hashedPassword));

        //создаем нового юзера
        const newUser = await User.create({
            ...generateUserData(),
            ...req.body,
            password: hashedPassword
        })
        // console.log(chalk.blue('newUser: ', newUser));

        const tokens = tokenService.generate({_id: newUser._id})

        // console.log('accessToken: ', accessToken);
        // console.log('refreshToken: ', refreshToken);
        // console.log('expiresIn: ', expiresIn);

        await tokenService.save(newUser._id, tokens.refreshToken)

        //201 - все ОК, нечто было создано
        res.status(201).send({...tokens, userId: newUser._id})

    }catch(e){
        res.status(500).json({
            message:'На сервере произошла неизвестная ошибка.'
        })
    }
}])

//POST signInWithPassword
router.post('/signInWithPassword', [
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'Empty password').exists(),
    async (req, res) => {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    error:{
                        message: 'INVALID_DATA',
                        code:400
                    }
                })
            }

            const {email, password} = req.body

            //находим юзера по Email
            const existingUser = await User.findOne({email})
            if(!existingUser){
                return  res.status(400).send({
                    error:{
                        message: 'EMAIL_NOT_FOUND',
                        code: 400
                    }
                })
            }

           //сравниваем зашифрованные пароли
           const isPasswordEqual = await bcrypt.compare(password, existingUser.password)
            if(!isPasswordEqual){
                return  res.status(400).send({
                    error:{
                        message: 'INVALID_PASSWORD',
                        code: 400
                    }
                })
            }

            const tokens = tokenService.generate({_id: existingUser._id})
            await tokenService.save(existingUser._id, tokens.refreshToken)

            res.status(200).send({...tokens, userId: existingUser._id})

        }catch (e){
            res.status(500).json({
            message:'На сервере произошла неизвестная ошибка.'
        })}
}])

function isTokenInvalid(data, dbToken) {
    return !data || !dbToken || data._id !== dbToken?.user?.toString();
}

//POST token
//обновление токена
router.post('/token', async (req, res) => {
    try {
        const {refresh_token: refreshToken} = req.body;
        const data = await tokenService.validateRefresh(refreshToken);

        const dbToken = await tokenService.findToken(refreshToken)

        if(isTokenInvalid(data, dbToken)) {
            return res.status(401).json({message: 'Unatorized'});
        }

        const tokens = tokenService.generate({
            _id: data._id
        });
        await tokenService.save(data._id, tokens.refreshToken)


        res.status(200).send({...tokens, userId: data._id});
    }catch (e){
        res.status(500).json({
            message:'На сервере произошла неизвестная ошибка.'
        })
    }
})

module.exports =router