const express = require('express')
const router = express.Router()
const admCntr = require('../controllers/admin')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next()
  }
  res.redirect('/login')
}

router.get('/', isAdmin, async (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  const skills = await admCntr.getSkills()

  // console.log(result);
  let infoSkills = req.flash('infoSkills');
  infoSkills = infoSkills?.length ? infoSkills : null;
  let infoImages = req.flash('infoImages');
  infoImages = infoImages?.length ? infoImages : null;
  res.render('pages/admin', { title: 'Admin page', skills, msgskill: infoSkills, msgfile: infoImages })
})

router.post('/skills', async (req, res, next) => {
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */
  try {
    const result = await admCntr.updateSkills(req.body)
    req.flash('infoSkills', 'Данные установлены')
    res.redirect('/admin')
    // res.render('pages/admin', { title: 'Admin page', msgskill: 'Данные установлены' })
  }
  catch (err) {
    req.flash('infoSkills', err)
    res.redirect('/admin')
    // res.render('pages/admin', { title: 'Admin page', msgskill: err }) 
  }


})


const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true }
  }
  if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true }
  }
  return { status: 'Ok', err: false }
}


router.post('/upload', (req, res, next) => {
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  let form = new formidable.IncomingForm()
  let upload = path.join('./public', 'assets', 'img', 'products')
  console.log(upload);
  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  // console.log(`dirname: ${__dirname}`)
  // console.log(`cwd: ${process.cwd()}`)

  form.uploadDir = path.join(process.cwd(), upload)

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err)
    }

    // const valid = validation(fields, files)

    // if (valid.err) {
    //   fs.unlinkSync(files.photo.path)
    //   req.flash("infoImages", valid.status)
    //   return res.redirect(`/admin`)
    // }
    console.log(files.photo);
    const fileName = path.join(upload, files.photo.name)

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err.message)
        return
      }

      // let dir = fileName.substr(fileName.indexOf('\\'))

      // db.set(fields.name, fileName)
      // db.save()
      req.flash('infoImages', 'Успешно загружено')
      res.redirect('/admin')
    })
  })

  res.send('Реализовать сохранения объекта товара на стороне сервера')
})

module.exports = router
