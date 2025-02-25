// File nay se cau hinh file cua chung ta
const express = require('express');
const path = require('path')
const viewEngine = (app) => {

   // Sau khi cai dat ejs thi phai khai bao oi luu tru file day

   app.set('views', path.join('./src', './views'));

   app.set('view engine', 'ejs')

   // config static file
   app.use(express.static(path.join('./src', 'public')))

   // Cho phép sử dụng Bootstrap từ node_modules
   app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')));
}

module.exports = viewEngine;