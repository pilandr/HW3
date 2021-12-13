const express = require('express')
const router = express.Router()
const { products } = require('../data.json')
const nodemailer = require('nodemailer')
const config = require('../configMail.json')
const admCntr = require('../controllers/admin')

router.get('/', async (req, res, next) => {
  const skills = await admCntr.getSkills()
  const info = req.flash('info');
  res.render('pages/index', { title: 'Main page', products, skills , msgemail: (!info.length)? null: info })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функционал отправки письма.
  if (!req.body.name || !req.body.email || !req.body.message) {
    // return res.render('pages/index', { title: 'Main page', products, skills, msgemail: "Все поля нужно заполнить!" })
    req.flash('info', "Все поля нужно заполнить!")
    res.redirect('/#form');
    return
  }

  const transporter = nodemailer.createTransport(config.mail.smtp)
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  }
  // отправляем почту
  transporter.sendMail(mailOptions, function (error, info) {
    // если есть ошибки при отправке - сообщаем об этом
    if (error) {
      // res.render('pages/index', { title: 'Main page', products, skills, msgemail: error.message })
      req.flash('info', error.message)
      res.redirect('/#form');
    } else {
      req.flash('info', "Письмо успешно отправлено")
      res.redirect('/#form');
    }
    // res.render('pages/index', { title: 'Main page', products, skills, msgemail: "Письмо успешно отправлено" })
    
  })
})

module.exports = router
